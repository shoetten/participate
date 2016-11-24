import React from 'react';
import {mount} from 'react-mounter';

import DataLoader from '../core/containers/data_loader';
import Home from './components/home';
import Beta from './components/beta';
import Imprint from './components/imprint';

export default function (injectDeps, {FlowRouter}) {
  const DataLoaderCtx = injectDeps(DataLoader);

  FlowRouter.route('/', {
    name: 'home',
    action() {
      mount(DataLoaderCtx, {
        content: () => (<Home />),
      });
    },
  });

  FlowRouter.route('/beta', {
    name: 'beta',
    action() {
      mount(DataLoaderCtx, {
        title: 'Beta',
        content: () => (<Beta />),
      });
    },
  });

  FlowRouter.route('/imprint', {
    name: 'imprint',
    action() {
      mount(DataLoaderCtx, {
        title: 'Imprint',
        content: () => (<Imprint />),
      });
    },
  });
}
