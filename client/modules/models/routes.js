import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '../core/components/main_layout';
import NavActions from './components/nav_actions';
import ModelList from './containers/model_list';
import Model from './containers/model';
import NewModel from './containers/new_model';

export default function (injectDeps, {FlowRouter}) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.route('/models', {
    name: 'models.list',
    action() {
      mount(MainLayoutCtx, {
        NavActions,
        content: () => (<ModelList />),
      });
    },
  });

  FlowRouter.route('/model/:modelId/:modelSlug', {
    name: 'models.single',
    action({modelId}) {
      mount(MainLayoutCtx, {
        NavActions,
        content: () => (<Model modelId={modelId} />),
      });
    },
  });

  FlowRouter.route('/model/new', {
    name: 'models.new',
    action() {
      mount(MainLayoutCtx, {
        NavActions,
        content: () => (<NewModel modal={false} />),
      });
    },
  });
}
