import routes from './routes';
import methodStubs from './configs/method_stubs';
import actions from './actions';

export default {
  routes,
  actions,
  load(context) {
    const {Meteor} = context;
    // XXX: Combine client and server methods?
    if (Meteor.isClient) {
      methodStubs(context);
    }
  },
};
