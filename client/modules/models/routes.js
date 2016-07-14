import React from 'react';
import {mount} from 'react-mounter';
import {AppContainer} from 'react-hot-loader';

import NavActions from './components/nav_actions';

// So we can call FlowRotuer again later during hot reload
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

  FlowRouter.route('/models', {
    name: 'models.list',
    action() {
      const ModelList = require('./containers/model_list').default;
      mount(MainLayoutCtxHot, {
        content: () => (<ModelList />),
      });
    },
  });

  FlowRouter.route('/model/new', {
    name: 'models.new',
    action() {
      const NewModel = require('./containers/edit_model').default;
      mount(MainLayoutCtxHot, {
        content: () => (<NewModel modal={false} />),
      });
    },
  });

  FlowRouter.route('/model/edit/:modelId', {
    name: 'models.edit',
    action({modelId}) {
      const ModelWrapper = require('./containers/model_wrapper').default;
      const EditModel = require('./containers/edit_model').default;
      mount(MainLayoutCtxHot, {
        content: () => (
          <ModelWrapper
            modelId={modelId}
            content={(model) => (<EditModel model={model} modal={false} />)}
          />
        ),
      });
    },
  });

  FlowRouter.route('/model/:modelId/:modelSlug', {
    name: 'models.single',
    action({modelId}) {
      const ModelWrapper = require('./containers/model_wrapper').default;
      const Model = require('./containers/model').default;
      mount(MainLayoutCtxHot, {
        NavActions: () => (<NavActions modelId={modelId} />),
        content: () => (
          <ModelWrapper
            modelId={modelId}
            content={(model) => (<Model model={model} />)}
          />
          ),
      });
    },
  });
}

if (module.hot) {
  module.hot.accept([
    '../core/components/main_layout',
    './containers/model_list',
    './containers/model_wrapper',
    './containers/model',
    './containers/edit_model',
  ], () => {
    // If any of the above files (or their dependencies) are updated, all we
    // really need to do is re-run the current route's action() method, which
    // will require() the updated modules and re-mount MainLayoutCtx
    // (which itself require()'s the updated MainLayout at render time).
    localFlowRouter._current.route._action(localFlowRouter._current.params);
  });
}
