import React from 'react';
import {mount} from 'react-mounter';

import MainLayout from '../core/components/main_layout';
import NavActions from './components/nav_actions';
import Home from './components/home';

export default function (injectDeps, {FlowRouter}) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.route('/', {
    name: 'home',
    action() {
      mount(MainLayoutCtx, {
        NavActions,
        content: () => (<Home />),
      });
    },
  });
}
