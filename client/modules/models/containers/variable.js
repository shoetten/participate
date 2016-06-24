import Variable from '../components/variable';
import {useDeps, composeAll} from 'mantra-core';

// All data is handled in the model container, so
// we are just injecting actions here

export const depsMapper = (context, actions) => ({
  changePosition: actions.variables.changePosition,
  remove: actions.variables.remove,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(Variable);
