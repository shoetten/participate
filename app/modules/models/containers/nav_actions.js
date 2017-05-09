import {useDeps, composeAll} from 'mantra-core';
import NavActions from '../components/nav_actions';

export const depsMapper = (context, actions) => ({
  handleDialog: actions.core.handleDialog,
});

export default composeAll(
  useDeps(depsMapper),
)(NavActions);
