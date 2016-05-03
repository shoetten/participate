import {Models} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {Match, check} from 'meteor/check';

export default function () {
  Meteor.publish('models.list', function () {
    // Ensure that the user is logged in. If not, return an empty array
    // to tell the client to remove the previously published docs.
    if (!Match.test(this.userId, String)) {
      return [];
    }

    const selector = {
      'members.userId': this.userId,
    };
    const options = {
      sort: ['modifiedAt', 'desc'],
    };

    return Models.find(selector, options);
  });

  Meteor.publish('models.single', function (modelId) {
    check(modelId, String);
    const selector = {
      _id: modelId,
      // If the model is not public the user has to be a member of it to see it.
      $or: [
        { permission: 'public' },
        { 'members.userId': this.userId },
      ],
    };
    return Models.find(selector);
  });
}
