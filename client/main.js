/* Following the Mantra spec
 * https://kadirahq.github.io/mantra/
 */

import 'react-hot-loader/patch';

import {createApp} from 'mantra-core';
import initContext from '/client/configs/context';

// import all modules here
import coreModule from '/client/modules/core';
import users from '/client/modules/users';
import home from '/client/modules/home';
import models from '/client/modules/models';

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(users);
app.loadModule(home);
app.loadModule(models);
app.init();
