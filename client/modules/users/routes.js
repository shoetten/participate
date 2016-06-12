import React from 'react';
import {mount} from 'react-mounter';
import {STATES} from 'meteor/std:accounts-ui';
import AuthForms from './components/auth_forms';

import MainLayout from '../core/components/main_layout';
import Bye from './components/bye.js';
// import NavActions from './components/nav_actions';

export default function (injectDeps, {FlowRouter}) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.route('/login', {
    name: 'users.login',
    action() {
      mount(MainLayoutCtx, {
        content: () => (
          <AuthForms
            {...{
              formState: STATES.SIGN_IN,
              signUpPath: '/signup',
            }}
          />
        ),
      });
    },
  });

  FlowRouter.route('/signup', {
    name: 'users.signup',
    action() {
      mount(MainLayoutCtx, {
        content: () => (
          <AuthForms
            {...{
              formState: STATES.SIGN_UP,
              loginPath: '/login',
            }}
          />
        ),
      });
    },
  });

  FlowRouter.route('/profile', {
    name: 'users.profile',
    action() {
      mount(MainLayoutCtx, {
        content: () => (
          <AuthForms
            {...{
              formState: STATES.PROFILE,
            }}
          />
        ),
      });
    },
  });

  FlowRouter.route('/bye', {
    name: 'users.bye',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<Bye />),
      });
    },
  });
}
