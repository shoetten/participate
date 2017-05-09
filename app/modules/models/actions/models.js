import getSlug from 'speakingurl';
import {pick} from 'lodash/fp';

export default {
  create({Meteor, LocalState}, model) {
    const title = model.title.trim();
    const slug = getSlug(title);

    if (model.members < 1) {
      return LocalState.set('ERROR_MSG', 'At least one member is required!');
    }

    const id = Meteor.uuid();
    Meteor.call(
      'models.create',
      id, title, slug,
      model.description,
      model.permission,
      model.members,
      (err) => {
        if (err) {
          return LocalState.set('ERROR_MSG', err.reason);
        }
        return LocalState.set('ERROR_MSG', null);
      },
    );

    return LocalState.set('ERROR_MSG', null);
  },

  update({Meteor, LocalState}, _id, newModel) {
    // Only update mutable attributes
    const model = pick(['userId', 'title', 'description', 'permission', 'members'], newModel);

    Meteor.call('models.update', _id, model, (err) => {
      if (err) {
        return LocalState.set('ERROR_MSG', err.reason);
      }
      return LocalState.set('ERROR_MSG', null);
    });
  },

  select({LocalState}, id) {
    return LocalState.set('SELECTED', id);
  },
};
