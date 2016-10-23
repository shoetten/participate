import routes from './routes';
import actions from './actions';
import configure from './configs/config';

export default {
  routes,
  actions,
  load() {
    // init module here
    configure();
  },
};
