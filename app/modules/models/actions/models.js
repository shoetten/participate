import $ from 'jquery';
import {Match} from 'meteor/check';

/**
 * Call the given Meteor method. Use this to avoid redundancy,
 * if nothing special is happening in your method callback.
 * @param  {Object}    options.Meteor     Meteor passed in by context
 * @param  {Object}    options.LocalState LocalState accessed through context
 * @param  {String}    method             The Meteor method to call
 * @param  {...[*]}    data               Data passed through to method
 */
function call({Meteor, LocalState}, method, ...data) {
  Meteor.call(method, ...data, (err) => {
    if (err) {
      LocalState.set('SAVED', false);
      LocalState.set('SAVING_ERROR', err.reason);
    } else {
      LocalState.set('SAVED', true);
    }
  });

  return LocalState.set('SAVING_ERROR', null);
}

export default {
  create({Meteor, LocalState, FlowRouter}, titleVal, slugVal, description, permission, members) {
    const title = titleVal.trim();
    const slug = slugVal.trim();
    if (!title || !slug ||
        !Match.test(permission, Boolean) ||
        !Match.test(members, [{id: String, name: String}])) {
      return LocalState.set('SAVING_ERROR', 'Title & slug are required!');
    }

    const id = Meteor.uuid();
    Meteor.call('models.create', id, title, slug, description, permission, members, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.reason);
      }
      // XXX: find a way to close the modal without jquery
      $('#new-model').closeModal();
      FlowRouter.go('models.single', {modelId: id, modelSlug: slug});
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },

  changeTitle(context, _id, titleVal) {
    const title = titleVal.trim();
    return call(context, 'models.changeTitle', _id, title);
  },

  changeSlug(context, _id, slugVal) {
    const slug = slugVal.trim();
    return call(context, 'models.changeSlug', _id, slug);
  },

  changeDescription(context, _id, description) {
    return call(context, 'models.changeDescription', _id, description);
  },

  changePermission(context, _id, permission) {
    return call(context, 'models.changePermission', _id, permission);
  },

  addMember(context, _id, member) {
    return call(context, 'models.addMember', _id, member);
  },

  removeMember(context, _id, userId) {
    return call(context, 'models.removeMember', _id, userId);
  },

  toggleAdminRights(context, _id, userId, makeAdmin) {
    return call(context, 'models.toggleAdminRights', _id, userId, makeAdmin);
  },

  select({LocalState}, id) {
    return LocalState.set('SELECTED', id);
  },
};
