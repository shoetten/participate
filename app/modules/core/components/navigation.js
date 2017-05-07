import React from 'react';
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import PersonIcon from 'material-ui/svg-icons/social/person';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import GroupWorkIcon from 'material-ui/svg-icons/action/group-work';
import {pathFor} from '/lib/utils';

const LoggedIn = (props) => {
  const {children, currentUser} = props;
  return (
    <ToolbarGroup lastChild key="loggedInControls">
      {children}
      <IconMenu
        iconButtonElement={
          <FlatButton
            label={currentUser.username}
            icon={<PersonIcon />}
          />
        }
      >
        <MenuItem
          primaryText="My models"
          leftIcon={<GroupWorkIcon />}
          href={pathFor('models.list')}
        />
        <MenuItem
          primaryText="Profile"
          leftIcon={<PersonIcon />}
          href={pathFor('users.profile')}
        />
        <MenuItem
          primaryText="Invite users"
          leftIcon={<PersonAddIcon />}
          href={pathFor('users.invite')}
        />
        <MenuItem
          primaryText="Logout"
          leftIcon={<ExitToAppIcon />}
          href={pathFor('users.bye')}
        />
      </IconMenu>
    </ToolbarGroup>
  );
};
LoggedIn.muiName = 'IconMenu';
LoggedIn.propTypes = {
  currentUser: PropTypes.object.isRequired,
  children: PropTypes.object,
};
LoggedIn.defaultProps = {
  children: null,
};

const LoggedOut = ({signUp}) => (
  <ToolbarGroup lastChild key="loggedOutControls">
    <FlatButton label="Login" href={pathFor('users.login')} />
    {signUp && <FlatButton label="Create Account" href={pathFor('users.signup')} />}
  </ToolbarGroup>
);
LoggedOut.muiName = 'FlatButton';
LoggedOut.propTypes = {
  signUp: PropTypes.bool.isRequired,
};

const Navigation = (props) => {
  const {model, currentUser} = props;

  return (
    <Paper rounded={false} >
      <Toolbar>
        <ToolbarGroup>
          {!!model &&
            <IconButton
              href={pathFor('models.list')}
              tooltip="Go back to models"
              tooltipPosition="bottom-right"
            >
              <NavigationClose />
            </IconButton>
          }
          <ToolbarTitle text={!model ? 'Participate' : model.title} />
        </ToolbarGroup>

        {currentUser ? <LoggedIn {...props} /> : <LoggedOut {...props} />}
      </Toolbar>
    </Paper>
  );
};

Navigation.propTypes = {
  currentUser: PropTypes.object,
  model: PropTypes.object,
};

Navigation.defaultProps = {
  children: null,
  currentUser: false,
  signUp: true,
  model: null,
};

export default Navigation;
