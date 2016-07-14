import ModelWrapper from '../components/model_wrapper';
import {useDeps, composeWithTracker, composeAll} from 'mantra-core';
import LoadingComponent from '/client/modules/core/components/loading';

export const composer = ({context, modelId, setPageTitle}, onData) => {
  const {Meteor, Collections} = context();

  if (Meteor.subscribe('models.single', modelId).ready()) {
    const model = Collections.Models.findOne(modelId);

    // Add usernames to members.
    model.members.map((member) => {
      const user = Collections.Users.findOne(member.userId);
      if (user) {
        member.username = user.username;
      }
      return member;
    });

    onData(null, {model});
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
  composeWithTracker(composer, LoadingComponent),
  useDeps(depsMapper)
)(ModelWrapper);
