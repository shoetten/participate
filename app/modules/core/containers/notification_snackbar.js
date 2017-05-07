import {useDeps, composeAll} from 'mantra-core';
import NotificationSnackbar from '../components/notification_snackbar';

export const depsMapper = (context, actions) => ({
  clearErrors: actions.core.clearErrors,
  context: () => context,
});

export default composeAll(
  useDeps(depsMapper)
)(NotificationSnackbar);
