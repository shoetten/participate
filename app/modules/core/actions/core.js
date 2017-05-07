// Global actions used in multiple modules are defined here.

export default {
  markUnsaved({LocalState}) {
    return LocalState.set('SAVED', false);
  },

  clearErrors({LocalState}) {
    LocalState.set('ERROR_MSG', '');
    return LocalState.set('NOTIFICATION_MSG', '');
  },
};
