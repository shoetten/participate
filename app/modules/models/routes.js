import React from 'react';
import {mount} from 'react-mounter';
import DataLoader from '../core/containers/data_loader';
import NavActions from './containers/nav_actions';
import ModelList from './containers/model_list';
import ModelWrapper from './components/model_wrapper';
import Model from './containers/model';
import EditModel from './containers/edit_model';
import Help from './components/help';

export default function (injectDeps, {FlowRouter}) {
  const DataLoaderCtx = injectDeps(DataLoader);

  FlowRouter.route('/models', {
    name: 'models.list',
    action() {
      mount(DataLoaderCtx, {
        content: () => (<ModelList />),
      });
    },
  });

  FlowRouter.route('/model/new', {
    name: 'models.new',
    action() {
      mount(DataLoaderCtx, {
        content: () => (<EditModel modal={false} />),
      });
    },
  });

  FlowRouter.route('/model/edit/:modelId', {
    name: 'models.edit',
    action({modelId}) {
      mount(DataLoaderCtx, {
        modelId,
        NavActions,
        modelView: 'edit',
        content: model => (
          <ModelWrapper
            model={model}
            content={() => (<EditModel model={model} modal={false} />)}
          />
        ),
      });
    },
  });

  FlowRouter.route('/model/help', {
    name: 'models.help',
    action() {
      mount(DataLoaderCtx, {
        NavActions,
        modelView: 'help',
        content: () => (<Help />),
      });
    },
  });

  FlowRouter.route('/model/help/:modelId', {
    name: 'models.help',
    action({modelId}) {
      mount(DataLoaderCtx, {
        modelId,
        NavActions,
        modelView: 'help',
        content: model => (
          <ModelWrapper
            model={model}
            content={() => (<Help model={model} />)}
          />
        ),
      });
    },
  });

  FlowRouter.route('/model/:modelId/:modelSlug', {
    name: 'models.single',
    action({modelId}) {
      mount(DataLoaderCtx, {
        modelId,
        NavActions,
        modelView: 'view',
        content: model => (
          <ModelWrapper
            model={model}
            content={() => (<Model model={model} />)}
          />
        ),
      });
    },
  });
}
