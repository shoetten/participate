import {useDeps, composeAll} from 'mantra-core';
import ModelWrapper from '../components/model_wrapper';

export const depsMapper = (context, actions) => ({
  setPageTitle: actions.core.setPageTitle,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(ModelWrapper);
