import Model from '../components/model';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context, modelId, setPageTitle}, onData) => {
  const {Meteor, Collections} = context();

  if (Meteor.subscribe('models.single', modelId).ready()) {
    const model = Collections.Models.findOne(modelId);
    const variables = Collections.Variables.find({modelId: model._id}).fetch();
    const links = Collections.Links.find({modelId: model._id}).fetch();

    onData(null, {model, variables, links});
  } else {
    onData();
  }

  // clear page title when unmounting container
  return setPageTitle;
};

export const depsMapper = (context, actions) => ({
  setPageTitle: actions.coreActions.setPageTitle,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Model);
