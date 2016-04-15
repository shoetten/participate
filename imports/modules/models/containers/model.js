import Model from '../components/model';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context, modelId}, onData) => {
  const {Meteor, Collections} = context();

  if (Meteor.subscribe('models.single', modelId).ready()) {
    const model = Collections.Models.findOne(modelId);
    onData(null, {model});
  } else {
    const model = Collections.Models.findOne(modelId);
    if (model) {
      onData(null, {model});
    } else {
      onData();
    }
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Model);
