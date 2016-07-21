import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';

export default function () {
  if (process.env.MAIL_FROM) {
    Accounts.emailTemplates.from = process.env.MAIL_FROM;
  }

  const appTitle = Meteor.settings.public.appTitle || 'Participate';
  Accounts.emailTemplates.siteName = appTitle;

  Accounts.emailTemplates.enrollAccount.subject = () => (
    `You have been invited to join ${appTitle}`
  );
  Accounts.emailTemplates.enrollAccount.text = (user, url) => (
    `Hey ${user.username},\n\n`
    + `You have been invited to join the beta version of ${appTitle}!\n\n`
    + `To activate your account, simply click the link below:\n${url}\n\n`
    + 'Please report any bugs you may encounter back to this email address!\n'
    + 'Thanks!\nSimon'
  );
}
