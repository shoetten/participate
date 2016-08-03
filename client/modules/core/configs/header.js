import {DocHead} from 'meteor/kadira:dochead';

export default function () {
  // define all static header attributes here
  DocHead.addMeta({
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  });
  DocHead.addLink({
    rel: 'shortcut icon', href: '/favicon.ico',
  });
}
