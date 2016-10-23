import { Accounts } from 'meteor/std:accounts-ui';
import { FlowRouter } from 'meteor/kadira:flow-router';

export default function () {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL',
    loginPath: '/login',
    signUpPath: '/signup',
    resetPasswordPath: '/reset-password',
    profilePath: '/profile',
    onSignedInHook: () => FlowRouter.go('models.list'),
    onSignedOutHook: () => FlowRouter.go('users.bye'),
    onPostSignUpHook: () => FlowRouter.go('models.list'),
    onEnrollAccountHook: () => FlowRouter.go('users.enroll'),
    onPostEnrollAccountHook: () => FlowRouter.go('models.list'),
  });
}
