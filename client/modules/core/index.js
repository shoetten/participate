// This has to be loaded first, in order to get HMR to work
import 'react-hot-loader/patch';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';
import actions from './actions';
import setHeader from './configs/header';

export default {
  routes,
  actions,
  load(context) {
    // init module here
    setHeader(context);

    // Needed for onTouchTap
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin();
  },
};
