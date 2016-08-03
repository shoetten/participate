import {useDeps, composeAll, composeWithTracker} from 'mantra-core';

import Navigation from '../components/navigation';

export const composer = ({context}, onData) => {
  const {Meteor, LocalState} = context();
  const signUp = Meteor.settings.public.signUp;

  if (Meteor.subscribe('users.current').ready()) {
    const currentUser = Meteor.user();
    onData(null, {currentUser, signUp});
  }
};

export const depsMapper = (context) => ({
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Navigation);
