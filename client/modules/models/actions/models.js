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
    // There is a method stub for this in the config/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('models.create', id, title, slug, description, permission, members, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }
      FlowRouter.go(`/models/${id}`);
      return LocalState.set('SAVING_ERROR', null);
    });

    return LocalState.set('SAVING_ERROR', null);
  },

  clearErrors({LocalState}) {
    return LocalState.set('SAVING_ERROR', null);
  },
};
