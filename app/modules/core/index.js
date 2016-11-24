// This has to be loaded first, in order to get HMR to work
import 'react-hot-loader/patch';
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
