import {reduce} from 'lodash/fp';
import {useDeps, composeAll, composeWithTracker} from 'mantra-core';
import MainLayout from '../components/main_layout';
import LoadingComponent from '../components/loading';

export const composer = ({context, modelId}, onData) => {
  const {Meteor, Collections} = context();

  if (modelId) {
    if (Meteor.subscribe('models.single', modelId).ready()) {
      const model = Collections.Models.findOne(modelId);

      if (model) {
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

        onData(null, {model});
      }
    } else {
      onData();
    }
  } else {
    onData(null, {});
  }
};

export const depsMapper = (context) => ({
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, LoadingComponent),
  useDeps(depsMapper)
)(MainLayout);
