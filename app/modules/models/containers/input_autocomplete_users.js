import {Mongo} from 'meteor/mongo';
import {useDeps, composeAll, compose, composeWithTracker} from 'mantra-core';
import InputAutocomplete from '../../helpers/components/input_autocomplete';

const AutocompleteUsers = new Mongo.Collection('autocomplete.users');

export const composer = ({context}, onData) => {
  const {Meteor, LocalState} = context();

  const query = LocalState.get('usersQuery');
  if (query && query.length >= 3 && Meteor.userId()) {
    if (Meteor.subscribe('autocomplete.users', query).ready()) {
      const options = {
        sort: ['username', 'asc'],
        limit: 6,
      };

      const suggestions = AutocompleteUsers.find({}, options).fetch().map(user => ({
        id: user._id,
        name: user.username,
      }));

      onData(null, {suggestions, busy: false});
    } else {
      onData(null, {suggestions: [], busy: true});
    }
  } else {
    onData(null, {suggestions: [], busy: false});
  }
};

export const initialDataComposer = ({context, initialMembers}, onData) => {
  if (initialMembers) {
    const initialTags = initialMembers.map(member => ({
      id: member._id,
      name: member.username,
    }));
    onData(null, {initialTags});
  } else {
    onData(null, {});
  }
};

export const depsMapper = (context, actions) => ({
  setQuery: actions.inputAutocompleteUsers.setQuery,
  context: () => context,
});

export default composeAll(
  compose(initialDataComposer),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(InputAutocomplete);
