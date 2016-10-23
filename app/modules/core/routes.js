import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '../core/components/main_layout';
import NotFound from './components/not_found';

export default function (injectDeps, {FlowRouter}) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.notFound = {
    action() {
      mount(MainLayoutCtx, {
        content: () => (<NotFound />),
      });
    },
  };
}
