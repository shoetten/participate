import {check} from 'meteor/check';

export default function ({Meteor, Collections}) {
  const {Links} = Collections;

  Meteor.methods({
    'links.create'(_id, fromId, toId, polarity, controlPointX, controlPointY, modelId) {
      // Don't check anything on client, to gain some performance.
      // This is safe, because the real checks are done server-side anyway

      const createdAt = new Date();

      const link = {
        _id, modelId,
        createdAt, modifiedAt: createdAt,
        fromId, toId,
        controlPointPos: {x: controlPointX, y: controlPointY},
        polarity,
      };

      Links.insert(link);
    },

    'links.remove'(_id, modelId) {
      // On client-side, only check if user is logged in
      check(Meteor.userId(), String);
      check(modelId, String);
      // check given data
      check(_id, String);

      Links.update({_id}, {$set: {removed: true}});
    },
  });
}
