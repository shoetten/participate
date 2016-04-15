/* Following the Mantra spec
 * https://kadirahq.github.io/mantra/
 */

import {createApp} from 'mantra-core';
import initContext from '/imports/configs/context';

// import all modules here
import coreModule from '/imports/modules/core';
import models from '/imports/modules/models';

// init context
const context = initContext();

// create app
const app = createApp(context);
app.loadModule(coreModule);
app.loadModule(models);
app.init();
