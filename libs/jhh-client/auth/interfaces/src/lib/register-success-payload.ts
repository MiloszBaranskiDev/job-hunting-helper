import { User } from '@jhh/shared/interfaces';

export interface RegisterSuccessPayload {
  token: string;
  user: User;
}
