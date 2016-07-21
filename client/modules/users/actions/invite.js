
export default {
  inviteUsers({Meteor, LocalState}, emails) {
    LocalState.set('LOADING', true);

    Meteor.call('users.inviteUsers', emails, (err) => {
      if (err) {
        LocalState.set('SAVING_ERROR', err.reason);
      }
      LocalState.set('LOADING', false);
    });

    return LocalState.set('SAVING_ERROR', null);
  },
};
