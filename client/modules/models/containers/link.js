import Link from '../components/link';
import {useDeps, composeAll} from 'mantra-core';

// All data is handled in the model container, so
// we are just injecting actions here

export const depsMapper = (context, actions) => ({
  changeControlPosition: actions.links.changeControlPosition,
  remove: actions.links.remove,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(Link);
