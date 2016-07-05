import Model from '../components/model';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import LoadingComponent from '/client/modules/core/components/loading';

export const composer = ({context, modelId, setPageTitle, clearErrors}, onData) => {
  const {Meteor, Collections, LocalState} = context();
  const error = LocalState.get('SAVING_ERROR');
  const selected = LocalState.get('SELECTED');

  if (Meteor.subscribe('models.single', modelId).ready()) {
    const model = Collections.Models.findOne(modelId);

    const selector = {
      modelId: model._id,
      removed: {$ne: true},
    };
    const variables = Collections.Variables.find(selector).fetch();
    const links = Collections.Links.find(selector).fetch();

    onData(null, {model, variables, links, selected, error});
  } else {
    onData();
  }

  // clear page title when unmounting container
  return () => {
    setPageTitle();
    clearErrors();
  };
};

export const depsMapper = (context, actions) => ({
  setPageTitle: actions.coreActions.setPageTitle,
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
  composeWithTracker(composer, LoadingComponent),
  useDeps(depsMapper)
)(Model);
