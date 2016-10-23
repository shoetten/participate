import models from './models';
import variables from './variables';
import links from './links';

export default function (context) {
  models(context);
  variables(context);
  links(context);
}
