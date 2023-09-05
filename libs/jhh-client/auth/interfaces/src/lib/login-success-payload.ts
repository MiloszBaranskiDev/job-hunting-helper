import { User } from '@jhh/shared/interfaces';

export interface LoginSuccessPayload {
  token: string;
  user: User;
}
