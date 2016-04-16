/* Following the Mantra spec
 * https://kadirahq.github.io/mantra/
 */

import {createApp} from 'mantra-core';
import initContext from '/client/configs/context';

// import all modules here
import coreModule from '/client/modules/core';
import home from '/client/modules/home';
import models from '/client/modules/models';

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(home);
app.loadModule(models);
app.init();
