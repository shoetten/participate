import React from 'react';
import {Accounts, STATES} from 'meteor/std:accounts-material';

const AuthForms = (props) => (
  <div className="auth-forms">
    <div className="text-wrap">
      <h1>
        {props.formState === STATES.SIGN_UP && 'Register'}
        {props.formState === STATES.ENROLL_ACCOUNT && 'Confirm account'}
        {props.formState === STATES.SIGN_IN && 'Login'}
        {props.formState === STATES.PROFILE && 'Profile'}
        {props.formState === STATES.PASSWORD_RESET && 'Reset password'}
      </h1>
      {props.formState === STATES.ENROLL_ACCOUNT &&
        <p>
          You have been invited to take part in the beta of Participate.
          To complete your registration, just type in your desired password below.
        </p>
      }
      <Accounts.ui.LoginForm {...props} />
    </div>
  </div>
);

AuthForms.propTypes = {
  formState: React.PropTypes.symbol,
};

export default AuthForms;
