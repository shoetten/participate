import {Meteor} from 'meteor/meteor';
import React from 'react';
import $ from 'jquery';
import {pathFor} from '../../core/libs/helpers';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    $('.dropdown-button').dropdown({
      belowOrigin: true,
    });
  }

  logout(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    Meteor.logout();
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
              <ul className="right">
                <li>
                  <a className="dropdown-button" href="#" data-activates="user-dropdown">
                    <i className="material-icons left">person</i>
                    {currentUser.username}
                    <i className="material-icons right">arrow_drop_down</i>
                  </a>
                  <ul id="user-dropdown" className="dropdown-content">
                    <li><a href="#!">
                      <i className="material-icons left">person</i>
                      Profile
                    </a></li>
                    <li><a onClick={this.logout} href="/logout" className="logout">
                      <i className="material-icons left">exit_to_app</i>
                      Logout
                    </a></li>
                  </ul>
                </li>
                <li>{children}</li>
              </ul> :
              <ul className="right">
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
