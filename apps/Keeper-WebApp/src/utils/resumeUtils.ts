import { TJob } from 'keeperTypes';
import { ResumesService, ChatGPTService } from 'keeperServices';

/**
 * Tailors a resume for a specific job using AI
 * @param employeeId The ID of the employee
 * @param job The job to tailor the resume for
 * @returns Promise with the tailored resume as a Blob
 */
export const tailorResumeForJob = async (employeeId: string, job: TJob): Promise<Blob> => {
  try {
    // Fetch the resume
    const resumeResponse = await ResumesService.getResume({ employeeId });

    if (!resumeResponse.success || !resumeResponse.data) {
      throw new Error('Unable to fetch your resume');
    }

    // Get the resume download URL
    const { downloadUrl } = resumeResponse.data;

    // Fetch the PDF content
    const resumeFileResponse = await fetch(downloadUrl);
    const resumeBlob = await resumeFileResponse.blob();

    // Convert resume to base64 and prepare the prompt
    const base64Resume = await blobToBase64(resumeBlob);

    // Prepare the prompt for ChatGPT to tailor the resume
    const prompt = generateTailoringPrompt(job, base64Resume);

    // Send to AI for tailoring
    const tailoredResumeResponse = await ChatGPTService.handleChatGPTRequest(prompt);

    // Convert the returned data to a Blob
    return new Blob([tailoredResumeResponse.data || ''], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    throw error;
  }
};

/**
 * Downloads a blob as a file
 * @param blob The blob to download
 * @param filename The name of the file to download
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href); // Clean up
};

/**
 * Converts a Blob to a base64 string
 * @param blob The blob to convert
 * @returns Promise with the base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Generates a prompt for the AI to tailor the resume
 * @param job The job to tailor the resume for
 * @param base64Resume The resume as a base64 string
 * @returns The prompt for the AI
 */
const generateTailoringPrompt = (job: TJob, base64Resume: string): string => {
  return `
    I need to tailor my resume for a job. Here's the job description:
    
    Job Title: ${job.jobTitle}
    Company: ${job.companyName}
    Location: ${job.jobLocation}
    Job Summary: ${job.jobSummary || 'Not provided'}
    Project Description: ${job.projectDescription || 'Not provided'}
    Seniority Level: ${job.seniorityLevel}
    
    Skills Required: ${job.relevantSkills ? job.relevantSkills.join(', ') : 'Not specified'}
    
    Here is my resume in base64 format: ${base64Resume}
    
    Please analyze my resume and tailor it specifically for this job by:
    1. Highlighting relevant skills and experiences that match the job requirements
    2. Adjusting the summary/objective to target this role
    3. Prioritizing experiences most relevant to this job
    4. Using keywords from the job description
    5. Return the new resume in same format as the original with spacing and all formatting/organization/ order of stuff as possible
    
    Return the tailored resume in PDF format
  `;
};
