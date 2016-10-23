/* eslint-disable global-require */
import React from 'react';
import {mount} from 'react-mounter';
import {AppContainer} from 'react-hot-loader';

// import MainLayout from '../core/components/main_layout';
// import Home from './components/home';

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

  FlowRouter.route('/', {
    name: 'home',
    action() {
      const Home = require('./components/home').default;

      mount(DataLoaderCtxHot, {
        content: () => (<Home />),
      });
    },
  });

  FlowRouter.route('/beta', {
    name: 'beta',
    action() {
      const Beta = require('./components/beta').default;

      mount(DataLoaderCtxHot, {
        title: 'Beta',
        content: () => (<Beta />),
      });
    },
  });

  FlowRouter.route('/imprint', {
    name: 'imprint',
    action() {
      const Imprint = require('./components/imprint').default;

      mount(DataLoaderCtxHot, {
        title: 'Imprint',
        content: () => (<Imprint />),
      });
    },
  });
}

if (module.hot) {
  module.hot.accept([
    '../core/components/main_layout',
    './components/home',
    './components/beta',
    './components/imprint',
  ], () => {
    // If any of the above files (or their dependencies) are updated, all we
    // really need to do is re-run the current route's action() method, which
    // will require() the updated modules and re-mount MainLayoutCtx
    // (which itself require()'s the updated MainLayout at render time).
    localFlowRouter._current.route._action(localFlowRouter._current.params);
  });
}
