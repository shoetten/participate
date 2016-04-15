import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '../core/components/main_layout';
import ModelList from './containers/model_list';
import Model from './containers/model';

export default function (injectDeps, {FlowRouter}) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.route('/models', {
    name: 'models.list',
    action() {
      mount(MainLayoutCtx, {
        content: () => (<ModelList />),
      });
    },
  });

  FlowRouter.route('/model/:modelId/:modelSlug', {
    name: 'models.single',
    action({modelId}) {
      mount(MainLayoutCtx, {
        content: () => (<Model postId={modelId} />),
      });
    },
  });
}
