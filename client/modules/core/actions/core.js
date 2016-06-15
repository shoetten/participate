// global actions used in multiple modules are defined here

export default {
  setPageTitle({LocalState}, pageTitle) {
    if (pageTitle) {
      return LocalState.set('PAGE_TITLE', pageTitle);
    }
    return LocalState.set('PAGE_TITLE', '');
  },
};
