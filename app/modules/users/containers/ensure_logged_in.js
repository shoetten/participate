import {useDeps, composeAll, composeWithTracker} from 'mantra-core';
import {authComposer} from 'meteor-auth';

import EnsureLoggedIn from '../components/ensure_logged_in';

export const composer = ({context}, onData) => {
  onData(null, {});
};

export const depsMapper = (context) => ({
  context: () => context,
});

export default composeAll(
  composeWithTracker(authComposer),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(EnsureLoggedIn);
