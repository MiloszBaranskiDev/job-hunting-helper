import register from './register';
import login from './login';
import removeAccount from './remove-account';

export function JhhServerControllerUser() {
  return {
    register,
    login,
    removeAccount,
  };
}
