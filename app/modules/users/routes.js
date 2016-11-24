import React from 'react';
import {mount} from 'react-mounter';
import {STATES} from 'meteor/std:accounts-ui';

import DataLoader from '../core/containers/data_loader';
import AuthForms from './components/auth_forms';
import Bye from './components/bye';
import Invite from './containers/invite';

export default function (injectDeps, {FlowRouter}) {
  const DataLoaderCtx = injectDeps(DataLoader);

  FlowRouter.route('/login', {
    name: 'users.login',
    action() {
      mount(DataLoaderCtx, {
        title: 'Login',
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
      mount(DataLoaderCtx, {
        title: 'Sign up',
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

  FlowRouter.route('/confirm-account', {
    name: 'users.enroll',
    action() {
      mount(DataLoaderCtx, {
        title: 'Confirm account',
        content: () => (
          <AuthForms
            {...{
              formState: STATES.ENROLL_ACCOUNT,
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
      mount(DataLoaderCtx, {
        title: 'Profile',
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
      mount(DataLoaderCtx, {
        content: () => (<Bye />),
      });
    },
  });

  FlowRouter.route('/invite', {
    name: 'users.invite',
    action() {
      mount(DataLoaderCtx, {
        title: 'Invite users',
        content: () => (<Invite />),
      });
    },
  });
}
