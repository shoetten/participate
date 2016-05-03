import {useDeps, composeAll, composeWithTracker} from 'mantra-core';

import Navigation from '../components/navigation';

export const composer = ({context}, onData) => {
  const {Meteor} = context();

  if (Meteor.subscribe('users.current').ready()) {
    const currentUser = Meteor.user();

    onData(null, {currentUser});
  }
};

export const depsMapper = (context) => ({
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Navigation);
