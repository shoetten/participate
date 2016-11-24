import routes from './routes';
import actions from './actions';
import setHeader from './configs/header';

export default {
  routes,
  actions,
  load(context) {
    // init module here
    setHeader(context);
  },
};
