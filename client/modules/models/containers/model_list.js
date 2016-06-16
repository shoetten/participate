import ModelList from '../components/model_list';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';

export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context();
  if (Meteor.subscribe('models.list').ready()) {
    const selector = {
      'members.userId': Meteor.userId(),
    };

    const models = Collections.Models.find(selector).fetch();
    // add usernames to members
    models.map((model) => {
      model.members.map((member) => {
        const user = Collections.Users.findOne(member.userId);
        if (user) {
          member.username = user.username;
        }
        return member;
      });
      return model;
    });

    onData(null, {models});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(ModelList);
