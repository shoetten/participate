import {find} from 'lodash/fp';
import {useDeps, composeAll, composeWithTracker} from 'mantra-core';
import EnsureUserRights from '../components/ensure_user_rights';

// Defined actions for now are 'view', 'edit' & 'admin'.
export const composer = ({context, model, action}, onData) => {
  const {Meteor} = context();
  const userId = Meteor.userId();
  let isAllowed = false;
  if (model) {
    // If user is logged in, look up associated member data.
    const member = userId ? find({userId}, model.members) : false;
    isAllowed =
      action === 'view' && (!!member || model.isPublic()) ||
      action === 'edit' && !!member ||
      action === 'admin' && !!member && member.isAdmin;
  }

  onData(null, {isAllowed});
};

export const depsMapper = (context) => ({
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(EnsureUserRights);
