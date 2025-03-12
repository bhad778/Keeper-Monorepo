import { TApplicationWithJob, TGetResumePayload, TUploadResumePayload } from './serviceTypes';
import { postRequest } from './serviceUtils';

const ResumesService = {
  getResume: (payload: TGetResumePayload) => postRequest('getResume', payload),
  uploadResume: (payload: TUploadResumePayload) => postRequest<TApplicationWithJob>('uploadResume', payload),
};

export default ResumesService;
