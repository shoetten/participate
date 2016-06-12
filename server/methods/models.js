import {Models} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {flow, uniqWith, isEqual, reduce} from 'lodash/fp';

export default function () {
  Meteor.methods({
    'models.create'(_id, title, slug, description, permission, members) {
      check(this.userId, String);

      check(_id, String);
      check(title, String);
      check(slug, String);
      check(description, String);
      check(permission, Boolean);
      check(members, [{id: String, name: String}]);

      const createdAt = new Date();
      members.push({id: this.userId});
      // Alternative to _.chain.
      // See https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba
      const membersDoc = flow(
        uniqWith(isEqual),
        reduce((results, member) => {
          // only add users that actually exist
          if (Meteor.users.findOne({_id: member.id})) {
            results.push({
              userId: member.id,
              isAdmin: member.id === this.userId,
              joined: createdAt,
            });
          }
          return results;
        }, [])
      )(members);

      const model = {
        _id, title, description, slug, createdAt,
        modifiedAt: createdAt,
        permission: permission ? 'public' : 'private',
        members: membersDoc,
      };

      Models.insert(model);
    },
  });
}
