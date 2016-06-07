import models from './models';
import users from './users';
import autocomplete from './autocomplete';

export default function () {
  users();
  models();
  autocomplete();
}
