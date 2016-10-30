/* eslint-disable prefer-arrow-callback */
import {Models, Users, Variables, Links} from '/lib/collections';
import {Match, check} from 'meteor/check';
import publishRelations from 'meteor/cottz:publish-relations';

export default function () {
  publishRelations('models.list', function () {
    // Ensure that the user is logged in. If not, return an empty array
    // to tell the client to remove the previously published docs.
    if (!Match.test(this.userId, String)) {
      return [];
    }

    const selector = {
      members: {$elemMatch: {userId: this.userId, removed: {$ne: true}}},
    };
    this.cursor(Models.find(selector), function (modelId, model) {
      // publish all users attached to model
      const memberIds = model.members.map(member => (member.userId));
      this.cursor(Users.find({_id: {$in: memberIds}}, {
        // publish only username for now
        fields: {username: 1},
      }));
    });

    return this.ready();
  });

  publishRelations('models.single', function (id) {
    check(id, String);

    const selector = {
      _id: id,
      // If the model is not public, the user has to be a member of it to see it.
      $or: [
        { permission: 'public' },
        { members: {$elemMatch: {userId: this.userId, removed: {$ne: true}}} },
      ],
    };
    this.cursor(Models.find(selector), function (modelId, model) {
      this.cursor(Variables.find({modelId}));
      this.cursor(Links.find({modelId}));

      // Publish all users attached to model.
      if (model.members) {
        const memberIds = model.members.map(member => (member.userId));
        this.cursor(Users.find({_id: {$in: memberIds}}, {
          // publish only username for now
          fields: {username: 1},
        }));
      }
    });

    return this.ready();
  });
}
