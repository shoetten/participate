import {Meteor} from 'meteor/meteor';
import {DocHead} from 'meteor/kadira:dochead';

export default function (context) {
  const {LocalState} = context;
  LocalState.set('APP_TITLE', Meteor.settings.public.appName);
  LocalState.set('PAGE_TITLE', '');

  // define all static header attributes here
  DocHead.addMeta({
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  });
}
