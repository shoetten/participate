import React from 'react';
import {mount} from 'react-mounter';
import {AppContainer} from 'react-hot-loader';

// import MainLayout from '../core/components/main_layout';
// import Home from './components/home';

let localFlowRouter;

export default function (injectDeps, {FlowRouter}) {
  localFlowRouter = FlowRouter;

  const MainLayoutCtxHot = function (props) {
    const MainLayout = require('../core/components/main_layout').default;
    const MainLayoutCtx = injectDeps(MainLayout);
    return (
      <AppContainer>
        <MainLayoutCtx {...props} />
      </AppContainer>
    );
  };

  FlowRouter.route('/', {
    name: 'home',
    action() {
      const Home = require('./components/home').default;
      mount(MainLayoutCtxHot, {
        content: () => (<Home />),
      });
    },
  });
}

if (module.hot) {
  module.hot.accept([
    '../core/components/main_layout',
    './containers/home',
  ], () => {
    // If any of the above files (or their dependencies) are updated, all we
    // really need to do is re-run the current route's action() method, which
    // will require() the updated modules and re-mount MainLayoutCtx
    // (which itself require()'s the updated MainLayout at render time).
    localFlowRouter._current.route._action(localFlowRouter._current.params);
  });
}
