
export default {
  create({Meteor, LocalState}, name, x, y, modelId) {
    const id = Meteor.uuid();

    // XXX: method stub
    Meteor.call('variables.create', id, name, x, y, modelId, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },

  changeName({Meteor, LocalState}, id, name, modelId) {
    // XXX: method stub
    Meteor.call('variables.changeName', id, name, modelId, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },
};
