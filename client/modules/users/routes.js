import React from 'react';
import {mount} from 'react-mounter';
import {Accounts, STATES} from 'meteor/std:accounts-ui';

import MainLayout from '../core/components/main_layout';
// import NavActions from './components/nav_actions';

export default function (injectDeps, {FlowRouter}) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.route('/login', {
    name: 'users.login',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<Accounts.ui.LoginForm {...{
          formState: STATES.SIGN_IN,
          signUpPath: '/signup',
        }} />),
      });
    },
  });

  FlowRouter.route('/signup', {
    name: 'users.signup',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<Accounts.ui.LoginForm {...{
          formState: STATES.SIGN_UP,
          loginPath: '/login',
        }} />),
      });
    },
  });
}
