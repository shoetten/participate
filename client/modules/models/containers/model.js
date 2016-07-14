import Model from '../components/model';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context, model, setPageTitle, clearErrors}, onData) => {
  const {Collections, LocalState} = context();
  const error = LocalState.get('SAVING_ERROR');

  const selector = {
    modelId: model._id,
    removed: {$ne: true},
  };
  const variables = Collections.Variables.find(selector).fetch();
  const links = Collections.Links.find(selector).fetch();

  onData(null, {model, variables, links, error});

  // clear errors when unmounting container
  return clearErrors;
};

export const selectComposer = ({context}, onData) => {
  const {LocalState} = context();
  const selected = LocalState.get('SELECTED');
  onData(null, {selected});
};

export const depsMapper = (context, actions) => ({
  select: actions.models.select,
  clearErrors: actions.models.clearErrors,
  createVariable: actions.variables.create,
  removeVariable: actions.variables.remove,
  changeVariableName: actions.variables.changeName,
  createLink: actions.links.create,
  removeLink: actions.links.remove,
  context: () => context,
});

export default composeAll(
  composeWithTracker(selectComposer),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Model);
