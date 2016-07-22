import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/std:accounts-ui';

export default function () {
  Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: !Meteor.settings.public.signUp,
  });
}
