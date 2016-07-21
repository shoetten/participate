// Global actions used in multiple modules are defined here.

export default {
  setPageTitle({LocalState}, pageTitle) {
    if (pageTitle) {
      return LocalState.set('PAGE_TITLE', pageTitle);
    }
    return LocalState.set('PAGE_TITLE', '');
  },

  markUnsaved({LocalState}) {
    return LocalState.set('SAVED', false);
  },

  clearErrors({LocalState}) {
    return LocalState.set('SAVING_ERROR', null);
  },
};
