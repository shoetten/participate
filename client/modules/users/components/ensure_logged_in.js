import React from 'react';
import {STATES} from 'meteor/std:accounts-ui';
import AuthForms from './auth_forms';

const EnsureLoggedIn = ({loggedIn, children}) => (
  <div>
    {loggedIn ? children : <NotLoggedInMessage />}
  </div>
);

EnsureLoggedIn.propTypes = {
  loggedIn: React.PropTypes.bool,
  children: React.PropTypes.element,
};

const NotLoggedInMessage = () => (
  <div>
    <p className="error">
      <i className="material-icons left">error_outline</i>
      Please log in to view this page.
    </p>
    <AuthForms
      {...{
        formState: STATES.SIGN_IN,
      }}
    />
  </div>
);

export default EnsureLoggedIn;
