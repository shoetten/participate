// Global actions used in multiple modules are defined here.

export default {
  markUnsaved({LocalState}) {
    return LocalState.set('SAVED', false);
  },

  handleDialog({LocalState}, newState) {
    const oldState = LocalState.get('DIALOG');
    const state = Object.assign({}, oldState, newState);
    return LocalState.set('DIALOG', state);
  },

  clearErrors({LocalState}) {
    LocalState.set('ERROR_MSG', '');
    return LocalState.set('NOTIFICATION_MSG', '');
  },
};
