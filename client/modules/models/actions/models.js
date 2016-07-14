import $ from 'jquery';
import {Match} from 'meteor/check';

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
        return LocalState.set('SAVING_ERROR', err.message);
      }
      // XXX: find a way to close the modal without jquery
      $('#new-model').closeModal();
      FlowRouter.go('models.single', {modelId: id, modelSlug: slug});
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },



  select({LocalState}, id) {
    return LocalState.set('SELECTED', id);
  },

  clearErrors({LocalState}) {
    return LocalState.set('SAVING_ERROR', null);
  },
};
