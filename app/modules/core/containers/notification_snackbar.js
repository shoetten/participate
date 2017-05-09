import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import NotificationSnackbar from '../components/notification_snackbar';

export const composer = ({context}, onData) => {
  const {LocalState} = context();
  const msg = LocalState.get('NOTIFICATION_MSG');
  const error = LocalState.get('ERROR_MSG');
  onData(null, {msg, error});
};

export const depsMapper = (context, actions) => ({
  clearErrors: actions.core.clearErrors,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper),
)(NotificationSnackbar);
