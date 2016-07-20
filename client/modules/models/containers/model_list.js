import {reduce} from 'lodash/fp';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import ModelList from '../components/model_list';
import LoadingComponent from '/client/modules/core/components/loading';

export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context();
  if (Meteor.subscribe('models.list').ready()) {
    const selector = {
      'members.userId': Meteor.userId(),
    };
    const options = {
      sort: {modifiedAt: 'desc'},
    };

    const models = Collections.Models.find(selector, options).fetch();
    // add usernames to members
    models.map((model) => {
      // Add usernames to members && filter removed ones.
      model.members = reduce((members, member) => {
        if (!member.removed) {
          const user = Collections.Users.findOne(member.userId);
          if (user) {
            member.username = user.username;
          }
          members.push(member);
        }
        return members;
      }, [], model.members);
      return model;
    });

    onData(null, {models});
  }
};

export default composeAll(
  composeWithTracker(composer, LoadingComponent),
  useDeps()
)(ModelList);
