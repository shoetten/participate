import ModelWrapper from '../components/model_wrapper';
import {useDeps, composeAll} from 'mantra-core';

export const depsMapper = (context, actions) => ({
  setPageTitle: actions.core.setPageTitle,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(ModelWrapper);
