import ModelList from '../components/model_list';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context();
  if (Meteor.subscribe('models.list').ready()) {
    const selector = {
      'members.userId': Meteor.userId(),
    };
    const options = {
      sort: ['modifiedAt', 'desc'],
    };

    const models = Collections.Models.find(selector, options).fetch();
    onData(null, {models});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(ModelList);
