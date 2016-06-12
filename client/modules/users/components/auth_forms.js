import {Accounts} from 'meteor/std:accounts-material';
// import {Accounts, STATES} from 'meteor/std:accounts-material';

class AuthForms extends Accounts.ui.LoginForm {
  fields() {
    // const {formState} = this.state;
    // if (formState === STATES.SIGN_UP) {
    //   return {
    //     ...super.fields(),
    //     firstname: {
    //       id: 'firstname',
    //       hint: 'Enter firstname',
    //       label: 'Firstname',
    //       onChange: this.handleChange.bind(this, 'firstname'),
    //     },
    //   };
    // }
    return super.fields();
  }

  signUp(options = {}) {
    // const { firstname = null } = this.state;
    // if (firstname !== null) {
    //   options.profile = Object.assign(options.profile || {}, {
    //     firstname,
    //   });
    // }
    super.signUp(options);
  }
}

export default AuthForms;
