import {Users} from '/lib/collections';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {check} from 'meteor/check';

export default function () {
  Meteor.methods({
    'users.inviteUser'(email) {
      check(this.userId, String);
      check(email, String);
      if (!SimpleSchema.RegEx.Email.test(email)) throw new Meteor.Error(400, 'Not a valid email');

      this.unblock();

      let user = Users.findOne({emails: {$elemMatch: {address: email}}});
      if (user) {
        throw new Meteor.Error(400, `User with email ${email} already exists!`);
      } else {
        // Use first part of email as username.
        const username = email.substring(0, email.indexOf('@'));
        const newUserId = Accounts.createUser({username, email});
        if (!newUserId) throw new Meteor.Error(500, 'User could not be created.');

        Accounts.sendEnrollmentEmail(newUserId);
        user = Users.findOne(newUserId);
      }

      return user;
    },

    'users.inviteUsers'(emails) {
      check(this.userId, String);
      check(emails, [String]);

      const users = [];
      emails.forEach((email) => {
        const user = Meteor.call('users.inviteUser', email);
        users.push(user);
      });

      return users;
    },
  });
}
