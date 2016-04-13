import {Models} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export default function () {
  Meteor.publish('models.list', () => {
    const selector = {
      'members.userId': this.userId,
    };
    const options = {
      sort: ['modifiedAt', 'desc'],
    };

    return Models.find(selector, options);
  });

  Meteor.publish('models.single', (modelId) => {
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
