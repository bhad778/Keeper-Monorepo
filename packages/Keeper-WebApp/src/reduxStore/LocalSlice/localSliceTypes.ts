import { TMatch } from 'types';
import { TJob } from 'types/employerTypes';

export type TLocalData = {
  selectedJob: TJob;
  selectedChannel: TMatch | undefined;
  isGetDataForSwipingLoading: boolean;
};
