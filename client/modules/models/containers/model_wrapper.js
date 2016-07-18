import ModelWrapper from '../components/model_wrapper';
import {useDeps, composeAll} from 'mantra-core';

export const depsMapper = (context, actions) => ({
  setPageTitle: actions.coreActions.setPageTitle,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(ModelWrapper);
