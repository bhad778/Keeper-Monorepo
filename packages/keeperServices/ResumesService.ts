import { TResumeData } from 'keeperTypes';

import { TApplicationWithJob, TGetResumePayload, TUploadResumePayload } from './serviceTypes';
import { postRequest } from './serviceUtils';

const ResumesService = {
  getResume: (payload: TGetResumePayload) => postRequest<TResumeData>('getResume', payload),
  uploadResume: (payload: TUploadResumePayload) => postRequest<TApplicationWithJob>('uploadResume', payload),
};

export default ResumesService;
