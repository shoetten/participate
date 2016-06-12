import {Mongo} from 'meteor/mongo';
import {useDeps, composeAll, composeWithTracker} from 'mantra-core';
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

      const suggestions = AutocompleteUsers.find({}, options).fetch().map((item) => ({
        id: item._id,
        name: item.username,
      }));

      onData(null, {suggestions, busy: false});
    } else {
      onData(null, {suggestions: [], busy: true});
    }
  } else {
    onData(null, {suggestions: [], busy: false});
  }
};

export const depsMapper = (context, actions) => ({
  setQuery: actions.input_autocomplete_users.setQuery,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(InputAutocomplete);
