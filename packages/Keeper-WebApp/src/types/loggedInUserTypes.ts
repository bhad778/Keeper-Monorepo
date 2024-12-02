import { TEmployer, TEmployee } from 'types';

export type TLoggedInUserData = TEmployer & TEmployee & { isLoggedIn: boolean } & { isAdmin: boolean };
