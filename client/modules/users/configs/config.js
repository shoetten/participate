import { Accounts } from 'meteor/std:accounts-ui';
import { FlowRouter } from 'meteor/kadira:flow-router';

export default function () {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL',
    loginPath: '/login',
    signUpPath: '/signup',
    profilePath: '/profile',
    onSignedInHook: () => FlowRouter.go('models.list'),
    onSignedOutHook: () => FlowRouter.go('users.bye'),
  });
}
