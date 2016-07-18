import React from 'react';
import {mount} from 'react-mounter';
import {AppContainer} from 'react-hot-loader';

import NavActions from './components/nav_actions';

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

  FlowRouter.route('/models', {
    name: 'models.list',
    action() {
      const ModelList = require('./containers/model_list').default;
      mount(DataLoaderCtxHot, {
        content: () => (<ModelList />),
      });
    },
  });

  FlowRouter.route('/model/new', {
    name: 'models.new',
    action() {
      const EditModel = require('./containers/edit_model').default;
      mount(DataLoaderCtxHot, {
        content: () => (<EditModel modal={false} />),
      });
    },
  });

  FlowRouter.route('/model/edit/:modelId', {
    name: 'models.edit',
    action({modelId}) {
      const ModelWrapper = require('./containers/model_wrapper').default;
      const EditModel = require('./containers/edit_model').default;
      mount(DataLoaderCtxHot, {
        modelId,
        NavActions,
        modelView: 'edit',
        content: (model) => (
          <ModelWrapper
            model={model}
            content={() => (<EditModel model={model} modal={false} />)}
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
      mount(DataLoaderCtxHot, {
        modelId,
        NavActions,
        modelView: 'view',
        content: (model) => (
          <ModelWrapper
            model={model}
            content={() => (<Model model={model} />)}
          />
          ),
      });
    },
  });
}

if (module.hot) {
  module.hot.accept([
    '../core/containers/data_loader',
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
