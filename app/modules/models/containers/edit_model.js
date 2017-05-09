import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import EditModel from '../components/edit_model';

export const composer = ({context, model}, onData) => {
  const {Meteor, LocalState} = context();
  const dialog = LocalState.get('DIALOG') || {};
  const open = !!dialog.edit;
  const editModel = !!model;

  // Add current user to new model
  // If an existing model is edited, just take that
  const fields = !editModel && Meteor.subscribe('users.current').ready() ? {
    title: '',
    description: '',
    members: [{
      userId: Meteor.userId(),
      username: Meteor.user().username,
      isAdmin: true,
      isInvited: false,
      isConfirmed: true,
    }],
    permission: 'private',
  } : model;

  onData(null, {open, editModel, fields});
};

export const depsMapper = (context, actions) => ({
  create: actions.models.create,
  update: actions.models.update,
  handleDialog: actions.core.handleDialog,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper),
)(EditModel);
