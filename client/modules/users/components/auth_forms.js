import React from 'react';
import {Accounts, STATES} from 'meteor/std:accounts-material';

const AuthForms = (props) => (
  <div className="auth-forms">
    <div className="text-wrap">
      <h1>
        {props.formState === STATES.SIGN_UP ? 'Register' : null}
        {props.formState === STATES.SIGN_IN ? 'Login' : null}
        {props.formState === STATES.PROFILE ? 'Profile' : null}
      </h1>
      <Accounts.ui.LoginForm {...props} />
    </div>
  </div>
);

AuthForms.propTypes = {
  formState: React.PropTypes.symbol,
};

export default AuthForms;
