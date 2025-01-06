import { SQSEvent } from 'aws-lambda';
import { JobSourceWebsiteEnum } from 'keeperTypes';
import { CompaniesService } from 'keeperServices';
import { glassdoorCompaniesQueueUrl, sourceWebsiteCompaniesQueueUrl } from 'keeperEnvironment';
import {
  brightDataIndeedCompanyTransformer,
  brightDataLinkedInCompanyTransformer,
  checkSnapshotStatusById,
  fetchSnapshotArrayDataById,
  requestSnapshotByUrlAndFilters,
  requeueMessage,
  requeueTimeout,
  sendMessageToQueue,
} from 'keeperUtils/brightDataUtils';

const getGlassdoorCompanyInfoSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j0bx501ockwldaqf&include_errors=true&type=discover_new&discover_by=keyword';

const glassdoorSearchUrl = 'https://www.glassdoor.com/Search/results.htm?keyword=';

// {
//   "snapshotId": "s_m4zl9nh512acix3jzh",
//   "sourceWebsite": "LinkedIn"
// }

// the companies queue holds messages that are just snapshotIds, and these snapshotIds hold data
export const handler = async (event: SQSEvent) => {
  const promises = event.Records.map(async record => {
    let snapshotId: string | undefined, sourceWebsite: string | undefined;

    try {
      const messageBody = JSON.parse(record.body);

      snapshotId = messageBody.snapshotId;
      sourceWebsite = messageBody.sourceWebsite;

      console.info(`Processing message with this data- ${JSON.stringify(messageBody)}`);

      if (!snapshotId || !sourceWebsite) {
        console.error(
          `Skipping. Missing required fields: snapshotId (${snapshotId}), sourceWebsite (${sourceWebsite}). Message: ${JSON.stringify(
            messageBody,
          )}`,
        );
        return;
      }

      console.info(`Processing snapshotId: ${snapshotId}`);

      // Step 1: Check snapshot status
      const status = await checkSnapshotStatusById(snapshotId);
      if (status !== 'ready') {
        console.info(`Snapshot ${snapshotId} is not ready. Requeuing.`);
        await requeueMessage(sourceWebsiteCompaniesQueueUrl, messageBody, requeueTimeout);
        return;
      }

      // Step 2: Fetch company data from BrightData
      const snapshotResultArray = await fetchSnapshotArrayDataById(snapshotId);

      if (!Array.isArray(snapshotResultArray) || snapshotResultArray.length === 0) {
        console.error(`Snapshot data for snapshotId ${snapshotId} is empty or invalid.`);
        return;
      }

      const brightDataCompany = snapshotResultArray[0];
      if (!brightDataCompany || typeof brightDataCompany !== 'object') {
        console.error(`Invalid company data in snapshot for snapshotId ${snapshotId}.`);
        return;
      }

      // Step 3: Transform company data
      console.info(`Transforming company data for snapshotId: ${snapshotId}`);
      const transformedCompany =
        sourceWebsite === JobSourceWebsiteEnum.Indeed
          ? brightDataIndeedCompanyTransformer(brightDataCompany)
          : sourceWebsite === JobSourceWebsiteEnum.LinkedIn
          ? brightDataLinkedInCompanyTransformer(brightDataCompany)
          : undefined;

      if (!transformedCompany) {
        console.info(`TransformCompany returned undefined. Skipping. Company: ${brightDataCompany}`);
        return;
      }

      console.info(`Upserting company data for ${transformedCompany.companyName} into the database.`);

      // Step 4: Upsert company data into the database
      const updateResponse = await CompaniesService.updateCompany({
        query: {
          $or: [
            { sourceWebsiteUrl: transformedCompany.sourceWebsiteUrl },
            { companyName: transformedCompany.companyName },
          ],
        },
        updateData: { ...transformedCompany, lastSourceWebsiteUpdate: new Date() },
        options: { upsert: true },
      });

      if (!updateResponse || !updateResponse.success) {
        console.error(`Failed to upsert company data for ${transformedCompany.companyName}.`);
        return;
      }

      console.info(`Successfully upserted company data for ${transformedCompany.companyName}.`);

      // Step 5: Request Glassdoor snapshot
      const glassdoorFilters = [
        {
          search_url: `${glassdoorSearchUrl}${encodeURIComponent(transformedCompany?.companyName || '')}`,
          max_search_results: 5,
        },
      ];

      const companySnapshotId = await requestSnapshotByUrlAndFilters(
        getGlassdoorCompanyInfoSnapshotUrl,
        glassdoorFilters,
      );

      console.info(
        `Successfully got Glassdoor snapshot ID ${companySnapshotId} for company ${transformedCompany.companyName}.`,
      );

      // Step 6: Enqueue Glassdoor snapshot ID for further processing
      const messageToGlassdoorQueue = {
        snapshotId: companySnapshotId,
        headquarters: transformedCompany.headquarters,
        companyName: transformedCompany.companyName,
        companyWebsiteUrl: transformedCompany.companyWebsiteUrl,
      };

      await sendMessageToQueue(glassdoorCompaniesQueueUrl, messageToGlassdoorQueue);
      console.info(
        `Enqueued Glassdoor snapshot to the Glassdoor companies queue: ${JSON.stringify(messageToGlassdoorQueue)}`,
      );
    } catch (error) {
      console.error(`Error processing snapshotId ${snapshotId}:`, error);
      throw error; // Let AWS handle retries and DLQ
    }
  });

  await Promise.all(promises);
  console.info('Batch processing complete.');
};

// crunchbase keyword

// Acuity%20Brands
// s_m58h784q2lxg991hjr - good

// Methodist%20Le%20Bonheur%20Healthcare
// s_m58h81bi1jsw4dan9a - good

// abacus.ai
// s_m58hq5th27ojpbxuqo - good but wont match because our DB doesnt have companyWebsiteUrl or headquarters, but name does match exactly. We should make it so if headquarters and companywebsiteurl is null but name matches exactly then it works too. Also just for crunchbase, do a check that says if url = the full company name with dashes in between make sure both are lowercased, which is an automatic match by itself

// dataannotation
// s_m58hr6v452zvms0m9 - doesnt exist in crunchbase

// University of Texas at Austin
// s_m58hu8w3qpkjitrfl - good and will match on companyWebsiteUrl or the new url field check

// Rank One Computing
// s_m58hw6pyslhdvf1di - good and will work on new url field check or name because companyWebsiteUrl and headquarters are null

// Goliath Partners
// s_m58hx8tw1bzugxvhat - this company doesnt exist in crunchbase

// Soft Tech Consulting
// s_m58hydeovhfq3wocn - good and will work on new url field check or name, because companyWebsiteUrl and headquarters are null

// crunchbase

// t-mobile
// s_m55x9rra2lelfz2zi6 - good

// abacus.ai
// s_m58fq0cb1a5zdem264 - bad

// abacusai
// s_m58fwpwp2ojrihh405 - bad

// abacus ai
// s_m58fwx6kykn62nkj7 - bad

// Abacus AI
// s_m58fx5mdw0fcl3s64 - bad

// Abacus.AI
// s_m58g43fmz0ucq19nf - bad

// methodist%20le%20bonheur%20healthcare
// s_m58g2wq61y267kr5nj - bad

// Acuity%20Brands
// s_m58ghion13rer3iacn - bad

// acuity%20brands
// s_m58ghzu7xuqz9vw3n - bad

// acuity brands
// s_m58gi9rg1xhppjy9o9 - bad

// glassdoor

// t-mobile
// s_m55ymm5w1wz4te5hjp - bad

// t%20mobile
// s_m55yzg93b53da2gz4 - good

// t mobile
// s_m55yzzgi510cxsp36 - good

// tmobile
// s_m55z0i2a1sw2dy1obb - good

// methodist-le-bonheur-healthcare
// s_m58i4l587fm807pah

// methodist le bonheur healthcare
// s_m58fsvs615t4tmcvh2 - bad

// methodistlebonheurhealthcare
// s_m58gb7fe1j3whfzkq3 - bad

// methodist%20le%20bonheur%20healthcare
// s_m58g8tcb1m3z63vsbf - bad

// Methodist%20Le%20Bonheur%20Healthcare
// s_m58g01bpegvitw3g8 - bad

// methodist
// s_m58g20ex2l84lwsr77 - bad

// Acuity%20Brands
// s_m58gdw7g11hjl5c8fg - bad

// acuity%20brands
// s_m58gekri1oxlw1vuq - bad

// acuity-brands
// s_m58gf4cg1uxo9nkd4y - s_m58i5c6l1wnr377cy4

// acuity brands
// s_m58gf4cg1uxo9nkd4y - bad

// DataAnnotation
// s_m58gnqlp18rmv9gu4q - bad

// dataannotation
// s_m58go72o1obtewp2ct - bad
