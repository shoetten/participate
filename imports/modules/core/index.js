import routes from './routes';

import injectTapEventPlugin from 'react-tap-event-plugin';

export default {
  routes,
  load() {
    // init module here

    // Needed for onTouchTap
    // http://stackoverflow.com/a/34015469/988941
    injectTapEventPlugin();
  },
};
