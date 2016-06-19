import Model from '../components/model';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context, modelId, setPageTitle, clearErrors}, onData) => {
  const {Meteor, Collections, LocalState} = context();
  const error = LocalState.get('SAVING_ERROR');

  if (Meteor.subscribe('models.single', modelId).ready()) {
    const model = Collections.Models.findOne(modelId);
    const variables = Collections.Variables.find({modelId: model._id}).fetch();
    const links = Collections.Links.find({modelId: model._id}).fetch();

    onData(null, {model, variables, links, error});
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
  clearErrors: actions.models.clearErrors,
  createVariable: actions.variables.create,
  changeVariableName: actions.variables.changeName,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Model);
