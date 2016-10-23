import {useDeps, composeAll} from 'mantra-core';
import Link from '../components/link';

// All data is handled in the model container, so
// we are just injecting actions here

export const depsMapper = (context, actions) => ({
  changeControlPosition: actions.links.changeControlPosition,
  changePolarity: actions.links.changePolarity,
  remove: actions.links.remove,
  select: actions.models.select,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(Link);
