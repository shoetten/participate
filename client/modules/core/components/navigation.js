import React from 'react';
import $ from 'jquery';
import {pathFor} from '../../core/libs/helpers';

class Navigation extends React.Component {
  componentDidMount() {
    $('.dropdown-button').dropdown({
      belowOrigin: true,
    });
  }

  render() {
    const {currentUser, children} = this.props;
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            <a href={pathFor('home')} className="brand-logo left">Participate!</a>
            {
              currentUser ?
                <ul className="right" key="loggedInControls">
                  <li>
                    <a className="dropdown-button" href="#" data-activates="user-dropdown">
                      <i className="material-icons left">person</i>
                      {currentUser.username}
                      <i className="material-icons right">arrow_drop_down</i>
                    </a>
                    <ul id="user-dropdown" className="dropdown-content">
                      <li><a href={pathFor('models.list')}>
                        {/* XXX: A clearer icon would be nice */}
                        <i className="material-icons left">group_work</i>
                        My Models
                      </a></li>
                      <li><a href={pathFor('users.profile')}>
                        <i className="material-icons left">person</i>
                        Profile
                      </a></li>
                      <li><a href={pathFor('users.bye')} className="logout">
                        <i className="material-icons left">exit_to_app</i>
                        Logout
                      </a></li>
                    </ul>
                  </li>
                  <li>{children}</li>
                </ul>
              :
                <ul className="right" key="loggedOutControls">
                  <li>
                    <a href={pathFor('users.login')}>
                      Login
                    </a>
                  </li>
                  <li>
                    <a href={pathFor('users.signup')}>
                      Create Account
                    </a>
                  </li>
                </ul>
            }
          </div>
        </nav>
      </div>
    );
  }
}

Navigation.propTypes = {
  currentUser: React.PropTypes.object,
  children: React.PropTypes.element,
};

export default Navigation;
