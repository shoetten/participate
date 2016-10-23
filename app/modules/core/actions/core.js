// Global actions used in multiple modules are defined here.

export default {
  markUnsaved({LocalState}) {
    return LocalState.set('SAVED', false);
  },

  clearErrors({LocalState}) {
    return LocalState.set('SAVING_ERROR', null);
  },
};
