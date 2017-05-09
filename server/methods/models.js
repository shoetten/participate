import {Models} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {check, Match} from 'meteor/check';
import {flow, uniqWith, isEqual, reduce} from 'lodash/fp';
import {isModelMember, isRemovedMember, checkUserPermissions} from '../lib/utils';

const transformMembers = (members) => {
  const newEmails = [];
  const today = new Date();

  // Alternative to _.chain. See
  // https://medium.com/making-internets/why-using-chain-is-a-mistake-9bc1f80d51ba
  const membersDoc = flow(
    uniqWith(isEqual),
    reduce((results, member) => {
      if (Meteor.users.findOne({_id: member.userId})) {
        if (member.userId === Meteor.userId() && !member.isAdmin) {
          throw new Meteor.Error(403, 'You cannot remove your own admin rights.');
        }
        if (member.userId === Meteor.userId() && member.removed) {
          throw new Meteor.Error(403, 'You cannot remove yourself from the model.');
        }

        results.push({
          userId: member.userId,
          isAdmin: member.isAdmin,
          joined: member.joined || today,
          removed: !!member.removed,
          isConfirmed: !member.isInvited,
        });
      } else if (member.username.indexOf('@') >= 0) {   // if we have an email
        // invite a new user to model
        newEmails.push(member.username);
      }
      return results;
    }, []),
  )(members);

  return {membersDoc, newEmails};
};

const inviteMembers = (id, emails) => {
  emails.forEach((email) => {
    try {
      const user = Meteor.call('users.inviteUser', email);
      Models.update({id}, {$push: {
        members: {
          userId: user._id,
          isAdmin: false,
          joined: new Date(),
          removed: false,
          isConfirmed: false,
        },
      }});
    } catch (e) {
      throw new Meteor.Error(400, e.message);
    }
  });
};

export default function () {
  Meteor.methods({
    'models.create'(_id, title, slug, description, permission, members) {
      check(this.userId, String);

      check(_id, String);
      check(title, String);
      check(slug, String);
      check(description, String);
      check(permission, String);
      check(members, [{
        userId: String,
        username: String,
        isAdmin: Boolean,
        isInvited: Boolean,
        isConfirmed: Boolean,
      }]);

      const createdAt = new Date();
      const {membersDoc, newEmails} = transformMembers(members);

      const model = {
        _id,
        title,
        description,
        slug,
        createdAt,
        modifiedAt: createdAt,
        permission,
        members: membersDoc,
      };

      Models.insert(model);
      inviteMembers(_id, newEmails);
    },

    'models.update'(_id, newModel) {
      check(this.userId, String);
      // check given data
      check(_id, String);
      checkUserPermissions(this.userId, _id, 'admin');
      check(newModel, {
        title: String,
        description: Match.Maybe(String),
        permission: String,
        members: [Object],
      });

      const {membersDoc, newEmails} = transformMembers(newModel.members);
      const model = Object.assign({}, newModel, {members: membersDoc});

      Models.update({_id}, {$set: model});
      inviteMembers(_id, newEmails);
    },

    'models.changeTitle'(_id, title) {
      check(this.userId, String);
      check(_id, String);
      checkUserPermissions(this.userId, _id, 'admin');
      check(title, String);

      Models.update({_id}, {$set: {title}});
    },

    'models.changeSlug'(_id, slug) {
      check(this.userId, String);
      check(_id, String);
      checkUserPermissions(this.userId, _id, 'admin');
      check(slug, String);

      Models.update({_id}, {$set: {slug}});
    },

    'models.changeDescription'(_id, description) {
      check(this.userId, String);
      check(_id, String);
      checkUserPermissions(this.userId, _id, 'admin');
      check(description, String);

      Models.update({_id}, {$set: {description}});
    },

    'models.changePermission'(_id, permission) {
      check(this.userId, String);
      check(_id, String);
      checkUserPermissions(this.userId, _id, 'admin');
      check(permission, Boolean);

      Models.update({_id}, {$set: {
        permission: permission ? 'public' : 'private',
      }});
    },

    'models.addMember'(modelId, member) {
      check(this.userId, String);
      check(modelId, String);
      checkUserPermissions(this.userId, modelId, 'admin');
      check(member, {id: String, name: String});

      if (isModelMember(member.id, modelId)) {
        throw new Meteor.Error(400, 'Member already exists!');
      } else if (isRemovedMember(member.id, modelId)) {
        Models.update({_id: modelId, 'members.userId': member.id}, {$set: {
          'members.$.removed': false,
        }});
      } else if (Meteor.users.findOne({_id: member.id})) {
        Models.update({_id: modelId}, {$push: {
          members: {
            userId: member.id,
            isAdmin: false,
            joined: new Date(),
            removed: false,
          },
        }});
      } else if (member.name.indexOf('@') >= 0) {   // if we have an email
        // invite a new user to model
        const user = Meteor.call('users.inviteUser', member.name);
        Models.update({_id: modelId}, {$push: {
          members: {
            userId: user._id,
            isAdmin: false,
            joined: new Date(),
            removed: false,
          },
        }});
      } else {
        throw new Meteor.Error(400, 'User does not exist!');
      }
    },

    'models.removeMember'(_id, userId) {
      check(this.userId, String);
      check(_id, String);
      checkUserPermissions(this.userId, _id, 'admin');
      check(userId, String);

      if (this.userId !== userId) {
        Models.update({_id, 'members.userId': userId}, {$set: {
          'members.$.removed': true,
        }});
      } else {
        throw new Meteor.Error(403, 'You cannot remove yourself from the model.');
      }
    },

    'models.toggleAdminRights'(_id, userId, makeAdmin) {
      check(this.userId, String);
      check(_id, String);
      checkUserPermissions(this.userId, _id, 'admin');
      check(userId, String);
      check(makeAdmin, Boolean);

      if (this.userId !== userId) {
        Models.update({_id, 'members.userId': userId}, {$set: {
          'members.$.isAdmin': makeAdmin,
        }});
      } else {
        throw new Meteor.Error(403, 'You cannot remove your own admin rights.');
      }
    },
  });
}
