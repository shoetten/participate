import {useDeps, composeAll, composeWithTracker} from 'mantra-core';
import MainLayout from '../components/main_layout';
import LoadingComponent from '../components/loading';

export const composer = ({context, modelId}, onData) => {
  const {Meteor, Collections} = context();

  if (modelId) {
    if (Meteor.subscribe('models.single', modelId).ready()) {
      const model = Collections.Models.findOne(modelId);

      if (model) {
        // Add usernames to members.
        model.members.map((member) => {
          const user = Collections.Users.findOne(member.userId);
          if (user) {
            member.username = user.username;
          }
          return member;
        });

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
