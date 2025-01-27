export const massageJobDataPrompt = (jobSummary: string, jobTitle: string) => {
  return `
        Analyze the following job description and job title, then extract the following details. If you cant get a good answer for any of the details below, just return it null. For example, if you cant find a responsibilities or qualifications that you can list as an array of strings just return null. If you cant find a good description of the project they will be working on return null.  Make it seem like it was written by the person who is providing the job:
        1. Compensation: Extract the dollar compensation if mentioned (return as a string or null if not mentioned).
        2. Formatted compensation: Please return an object with this type:
          {
            type: 'Salary' | 'Contract' | 'Contract To Hire';
            payRange?: { min: number; max: number };
          }
          - Determine the 'type' as one of the following:
            - **"Salary"** if the compensation includes an annual range or mentions an annual salary.
            - **"Contract"** if the compensation includes an hourly rate and no mention of "to hire."
            - **"Contract To Hire"** if the job description or job title suggests the role starts as a contract but has the potential to transition to a permanent position (e.g., mentions "contract to hire" explicitly or similar phrases like "temp to hire").
          - Extract the 'payRange' as '{ min: number; max: number }':
            - Example 1: "$157,000 - $190,000" -> { type: "Salary", payRange: { min: 157000, max: 190000 } }
            - Example 2: "$70 - $90 per hour" -> { type: "Contract", payRange: { min: 70, max: 90 } }
            - Example 3: "This is a contract-to-hire role with a pay range of $70-$90/hour." -> { type: "Contract To Hire", payRange: { min: 70, max: 90 } }
            - Example 4: "California: $134,900.00 - $216,975.00; Illinois and Colorado: $129,000.00 - $182,250.00; Washington, New Jersey and New York (including NYC metro area): $129,000.00 - $190,550.00"
              -> { type: "Salary", payRange: { min: 129000, max: 216975 } }
            - If no range is mentioned, leave 'payRange' as undefined.
        3. Location flexibility:
          - Return "onsite" for 100% onsite jobs,
          - "remote" for 100% remote jobs,
          - "hybrid - x days" for hybrid jobs with x days mentioned,
          - "hybrid" if hybrid is mentioned but the number of days isn't specified.
        4. Job summary: Provide a general summary of the job description you were passed and try to exclude including stuff from other fields like benefits, qualifications, etc. 
        5. Project description: Provide a summary of the project that the potential employee will be working on (exclude benefits, location, qualifications, and responsibilities).
        6. Normalize the provided job title into a standard format, removing any extraneous information or location details. Here are some examples:
          - "Senior Software Engineer (frontend), Product Foundation" -> "Senior Frontend Engineer"
          - "Senior Web Developer (hybrid in San Francisco)" -> "Senior Web Developer"
          - "Mid Level Full Stack React/node.js Developer" -> "Mid Level Full Stack Developer"
          - "Staff Software Engineer - Front-end" -> "Staff Frontend Engineer"
          - "Software Engineer, Full Stack" -> "Full Stack Software Engineer"
          - "Principal Software Engineer - Frontend" -> "Principal Frontend Engineer"
          - "Software Engineer - Fullstack, Atlanta" -> "Full Stack Software Engineer"
        7. Benefits: List any benefits mentioned in the job description (return as an array of strings or null if none are mentioned).
        8. Responsibilities: Extract the responsibilities mentioned in the job description (return as an array of strings or null if none are mentioned).
        9. Qualifications: Extract the responsibilities mentioned in the job description (return as an array of strings or null if none are mentioned).
  
        Respond in JSON format with the following structure:
        {
          "compensation": string | null,
          "formattedCompensation": { type: 'Salary' | 'Contract' | 'Contract To Hire'; payRange?: { min: number; max: number } } | null,
          "locationFlexibility": string | null,
          "projectDescription": string | null,
          "jobSummary": string,
          "jobTitle": string,
          "benefits": string[] | null,
          "responsibilities": string[],
          "qualifications": string[]
        }
  
        Job Description:
        "${jobSummary}"
  
        Job Title:
        "${jobTitle}"
      `;
};
