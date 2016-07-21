import EditModel from '../components/edit_model';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context, clearErrors}, onData) => {
  const {LocalState} = context();
  const saved = LocalState.get('SAVED');
  const error = LocalState.get('SAVING_ERROR');

  onData(null, {saved, error});

  // clearErrors when unmounting the component
  return clearErrors;
};

export const depsMapper = (context, actions) => ({
  create: actions.models.create,
  changeTitle: actions.models.changeTitle,
  changeSlug: actions.models.changeSlug,
  changeDescription: actions.models.changeDescription,
  changePermission: actions.models.changePermission,
  addMember: actions.models.addMember,
  removeMember: actions.models.removeMember,
  toggleAdminRights: actions.models.toggleAdminRights,
  markUnsaved: actions.core.markUnsaved,
  clearErrors: actions.core.clearErrors,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(EditModel);
