/* eslint-disable global-require */
import React from 'react';
import {mount} from 'react-mounter';
import {AppContainer} from 'react-hot-loader';
import {STATES} from 'meteor/std:accounts-ui';
import AuthForms from './components/auth_forms';
import Bye from './components/bye';

// So we can call FlowRotuer again later during hot reload
let localFlowRouter;

export default function (injectDeps, {FlowRouter}) {
  localFlowRouter = FlowRouter;

  const DataLoaderCtxHot = function (props) {
    const DataLoader = require('../core/containers/data_loader').default;

    const DataLoaderCtx = injectDeps(DataLoader);
    return (
      <AppContainer>
        <DataLoaderCtx {...props} />
      </AppContainer>
    );
  };

  FlowRouter.route('/login', {
    name: 'users.login',
    action() {
      mount(DataLoaderCtxHot, {
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
      mount(DataLoaderCtxHot, {
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
      mount(DataLoaderCtxHot, {
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
      mount(DataLoaderCtxHot, {
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
      mount(DataLoaderCtxHot, {
        content: () => (<Bye />),
      });
    },
  });

  FlowRouter.route('/invite', {
    name: 'users.invite',
    action() {
      const Invite = require('./containers/invite').default;

      mount(DataLoaderCtxHot, {
        title: 'Invite users',
        content: () => (<Invite />),
      });
    },
  });
}

if (module.hot) {
  module.hot.accept([
    './containers/invite',
  ], () => {
    // If any of the above files (or their dependencies) are updated, all we
    // really need to do is re-run the current route's action() method, which
    // will require() the updated modules and re-mount DataLoaderCtxHot
    // (which itself require()'s the updated MainLayout at render time).
    localFlowRouter._current.route._action(localFlowRouter._current.params);
  });
}
