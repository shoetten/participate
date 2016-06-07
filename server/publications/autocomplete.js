import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {Match, check} from 'meteor/check';

export default function () {
  Meteor.publish('autocomplete.users', function (query) {
    check(query, String);

    // Ensure that the user is logged in. If not, return an empty array
    // to tell the client to remove the previously published docs.
    if (!Match.test(this.userId, String)) {
      return [];
    }

    if (query.length >= 3) {
      const selector = {
        $or: [
          {
            username: {
              $regex: new RegExp(`^${query}`),
            },
          },
          {
            emails: {
              $in: [new RegExp(`^${query}`)],
            },
          },
        ],
      };
      const options = {
        sort: ['username', 'asc'],
        limit: 6,
        fields: {
          username: 1,
        },
      };

      // use undocumented function to publish to custom collection
      Mongo.Collection._publishCursor(
        Meteor.users.find(selector, options),
        this,
        'autocomplete.users'
      );

      this.ready();
    }

    // if minimum query length is not reached, return empty array
    return [];
  });
}
