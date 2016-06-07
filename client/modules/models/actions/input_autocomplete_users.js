export default {
  setQuery({Meteor, LocalState, FlowRouter}, query) {
    if (query) {
      return LocalState.set('usersQuery', query);
    }
    return LocalState.set('usersQuery', '');
  },
};
