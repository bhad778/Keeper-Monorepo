import { TEmployer, TEmployee } from 'keeperTypes';

export type TLoggedInUserData = TEmployer & TEmployee & { isLoggedIn: boolean } & { isAdmin: boolean };
