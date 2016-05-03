import routes from './routes';
import configure from './configs/config';

export default {
  routes,
  load() {
    // init module here
    configure();
  },
};
