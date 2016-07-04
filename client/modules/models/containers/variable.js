import Variable from '../components/variable';
import {useDeps, composeAll} from 'mantra-core';

// All data is handled in the model container, so
// we are just injecting actions here

export const depsMapper = (context, actions) => ({
  changePosition: actions.variables.changePosition,
  changeDimensions: actions.variables.changeDimensions,
  remove: actions.variables.remove,
  select: actions.models.select,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(Variable);
