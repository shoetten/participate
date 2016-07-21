import {useDeps, composeAll, composeWithTracker} from 'mantra-core';
import Invite from '../components/invite';

export const composer = ({context, clearErrors}, onData) => {
  const {LocalState} = context();
  const loading = LocalState.get('LOADING');
  const error = LocalState.get('SAVING_ERROR');

  onData(null, {loading, error});

  // clearErrors when unmounting the component
  return clearErrors;
};

export const depsMapper = (context, actions) => ({
  inviteUsers: actions.invite.inviteUsers,
  markUnsaved: actions.core.markUnsaved,
  clearErrors: actions.core.clearErrors,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Invite);
