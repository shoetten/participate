
export default {
  create({Meteor, LocalState}, name, x, y, dimensions, modelId, callback) {
    const id = Meteor.uuid();

    Meteor.call(
      'variables.create',
      id, name,
      x, y,
      Math.round(dimensions.width), Math.round(dimensions.height),
      modelId,
      (err) => {
        if (err) {
          return LocalState.set('SAVING_ERROR', err.reason);
        }
        return LocalState.set('SAVING_ERROR', null);
      }
    );

    callback(id);
    return LocalState.set('SAVING_ERROR', null);
  },

  changeName({Meteor, LocalState}, id, name, modelId) {
    Meteor.call('variables.changeName', id, name, modelId, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.reason);
      }
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },

  changePosition({Meteor, LocalState}, id, x, y, modelId) {
    Meteor.call('variables.changePosition', id, x, y, modelId, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.reason);
      }
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },

  changeDimensions({Meteor, LocalState}, id, dimensions, modelId) {
    Meteor.call(
      'variables.changeDimensions',
      id,
      Math.round(dimensions.width), Math.round(dimensions.height),
      modelId,
      (err) => {
        if (err) {
          return LocalState.set('SAVING_ERROR', err.reason);
        }
        return LocalState.set('SAVING_ERROR', null);
      }
    );

    return LocalState.set('SAVING_ERROR', null);
  },

  remove({Meteor, LocalState}, id, modelId) {
    Meteor.call('variables.remove', id, modelId, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.reason);
      }
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },
};
