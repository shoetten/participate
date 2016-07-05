
export default {
  create({Meteor, LocalState}, fromVar, toVar, polarity, modelId, callback) {
    const id = Meteor.uuid();

    // Set the initial control point position to the mid point
    // between the two variables. This results in a straight line.
    const controlPointPos = {
      x: Math.round((fromVar.position.x + toVar.position.x) / 2),
      y: Math.round((fromVar.position.y + toVar.position.y) / 2),
    };

    Meteor.call(
      'links.create',
      id,
      fromVar._id, toVar._id,
      polarity,
      controlPointPos.x, controlPointPos.y,
      modelId,
      (err) => {
        if (err) {
          return LocalState.set('SAVING_ERROR', err.message);
        }
        return LocalState.set('SAVING_ERROR', null);
      }
    );

    callback(id);
    return LocalState.set('SAVING_ERROR', null);
  },

  changeControlPosition({Meteor, LocalState}, id, controlPointPos, modelId) {
    Meteor.call(
      'links.changeControlPosition',
      id,
      Math.round(controlPointPos.x), Math.round(controlPointPos.y),
      modelId,
      (err) => {
        if (err) {
          return LocalState.set('SAVING_ERROR', err.message);
        }
        return LocalState.set('SAVING_ERROR', null);
      }
    );

    return LocalState.set('SAVING_ERROR', null);
  },

  changePolarity({Meteor, LocalState}, id, polarity, modelId) {
    Meteor.call('links.changePolarity', id, polarity, modelId, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },

  remove({Meteor, LocalState}, id, modelId) {
    Meteor.call('links.remove', id, modelId, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },
};
