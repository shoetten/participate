import React from 'react';
import $ from 'jquery';
import {DocHead} from 'meteor/kadira:dochead';
import {pathFor} from '../../core/libs/helpers';

class Navigation extends React.Component {
  componentDidMount() {
    $('.dropdown-button').dropdown({
      belowOrigin: true,
      alignment: 'right',
    });

    this.setTitle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setTitle(nextProps);
  }

  setTitle({pageTitle, appTitle}) {
    DocHead.setTitle(`${pageTitle ? `${pageTitle} | ` : ''}${appTitle}`);
  }

  render() {
    const {currentUser, children, appTitle, pageTitle} = this.props;
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            {
              pageTitle ?
                <span className="brand-logo left">
                  <a title="Go back to dashboard" href={pathFor('home')} className="back">
                    <i className="material-icons">chevron_left</i>
                  </a>
                  <span>{pageTitle}</span>
                </span>
              :
                <a href={pathFor('home')} className="brand-logo left">
                  {appTitle}
                </a>
            }

            {
              currentUser ?
                <ul className="right" key="loggedInControls">
                  <li className="user">
                    <a className="dropdown-button" href="#" data-activates="user-dropdown">
                      <i className="material-icons left">person</i>
                      <span>{currentUser.username}</span>
                      <i className="material-icons right">arrow_drop_down</i>
                    </a>
                    <ul id="user-dropdown" className="dropdown-content">
                      <li><a href={pathFor('models.list')}>
                        {/* XXX: A clearer icon would be nice */}
                        <i className="material-icons left">group_work</i>
                        <span>My Models</span>
                      </a></li>
                      <li><a href={pathFor('users.profile')}>
                        <i className="material-icons left">person</i>
                        <span>Profile</span>
                      </a></li>
                      <li><a href={pathFor('users.bye')} className="logout">
                        <i className="material-icons left">exit_to_app</i>
                        <span>Logout</span>
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
  appTitle: React.PropTypes.string.isRequired,
  pageTitle: React.PropTypes.string,
};

export default Navigation;
