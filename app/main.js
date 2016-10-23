/* Following the Mantra spec
 * https://kadirahq.github.io/mantra/
 */

import {createApp} from 'mantra-core';
import initContext from './configs/context';

// import all modules here
import coreModule from './modules/core';
import users from './modules/users';
import home from './modules/home';
import models from './modules/models';

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(users);
app.loadModule(home);
app.loadModule(models);
app.init();
