import {Models, Users, Variables, Links} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {Match, check} from 'meteor/check';

export default function () {
  Meteor.publishComposite('models.list', function () {
    // Ensure that the user is logged in. If not, return an empty array
    // to tell the client to remove the previously published docs.
    if (!Match.test(this.userId, String)) {
      return [];
    }

    return {
      find() {
        const selector = {
          members: {$elemMatch: {userId: this.userId, removed: {$ne: true}}},
        };
        return Models.find(selector);
      },

      children: [
        {
          find(model) {
            // publish all users attached to model
            const memberIds = model.members.map((member) => (member.userId));
            const selector = {
              _id: {$in: memberIds},
            };
            const options = {
              // publish only username for now
              fields: {username: 1},
            };
            return Users.find(selector, options);
          },
        },
      ],
    };
  });

  Meteor.publishComposite('models.single', function (modelId) {
    check(modelId, String);

    return {
      find() {
        const selector = {
          _id: modelId,
          // If the model is not public, the user has to be a member of it to see it.
          $or: [
            { permission: 'public' },
            { members: {$elemMatch: {userId: this.userId, removed: {$ne: true}}} },
          ],
        };
        return Models.find(selector);
      },

      children: [
        {
          find(model) {
            return Variables.find({modelId: model._id});
          },
        },
        {
          find(model) {
            return Links.find({modelId: model._id});
          },
        },
        {
          find(model) {
            // publish all users attached to model
            const memberIds = model.members.map((member) => (member.userId));
            const selector = {
              _id: {$in: memberIds},
            };
            const options = {
              // publish only username for now
              fields: {username: 1},
            };
            return Users.find(selector, options);
          },
        },
      ],
    };
  });
}
