import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';

// This has to be loaded first, in order to get HMR to work
import 'react-hot-loader/patch';

export default {
  routes,
  load() {
    // init module here

    // Needed for onTouchTap
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin();
  },
};
