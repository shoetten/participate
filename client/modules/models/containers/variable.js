import Variable from '../components/variable';
import {useDeps, composeAll} from 'mantra-core';

// no data fetching here, because the model container
// handles all the data stuff

export const depsMapper = (context, actions) => ({
  changeName: actions.variables.changeName,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(Variable);
