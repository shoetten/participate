export default {
  create({Meteor, LocalState, FlowRouter}, title, content) {
    if (!title || !content) {
      return LocalState.set('SAVING_ERROR', 'Title & Content are required!');
    }

    const id = Meteor.uuid();
    // There is a method stub for this in the config/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('models.create', id, title, content, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }
    });
    FlowRouter.go(`/models/${id}`);

    return LocalState.set('SAVING_ERROR', null);
  },

  clearErrors({LocalState}) {
    return LocalState.set('SAVING_ERROR', null);
  },
};
