import { Accounts } from 'meteor/std:accounts-ui';

export default function () {
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false,
  });
}
