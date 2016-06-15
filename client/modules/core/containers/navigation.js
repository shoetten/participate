import {useDeps, composeAll, composeWithTracker} from 'mantra-core';

import Navigation from '../components/navigation';

export const composer = ({context}, onData) => {
  const {Meteor, LocalState} = context();

  if (Meteor.subscribe('users.current').ready()) {
    const currentUser = Meteor.user();
    const appTitle = LocalState.get('APP_TITLE');
    const pageTitle = LocalState.get('PAGE_TITLE').trim();

    onData(null, {currentUser, appTitle, pageTitle});
  }
};

export const depsMapper = (context) => ({
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Navigation);
