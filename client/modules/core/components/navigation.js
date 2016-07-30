import React from 'react';
import $ from 'jquery';
import {DocHead} from 'meteor/kadira:dochead';
import {pathFor} from '/lib/utils';

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
    const {currentUser, children, appTitle, pageTitle, signUp, model} = this.props;
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper">
            {pageTitle ?
              <span className="brand-logo left">
                <a
                  title="Go back to models" className="back"
                  href={pathFor('models.list')}
                >
                  <i className="material-icons">chevron_left</i>
                </a>
                {model ?
                  <a
                    title={pageTitle}
                    href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}
                  >
                    {pageTitle}
                  </a>
                :
                  <span>{pageTitle}</span>
                }
              </span>
            :
              <a href={pathFor('home')} className="brand-logo left">
                {appTitle}
              </a>
            }

            <a href={pathFor('beta')} className="brand-logo center beta-warning">
              <i className="material-icons left">warning</i> Beta
            </a>

            {currentUser ?
              <ul className="right" key="loggedInControls">
                <li className="nav-actions">{children}</li>
                <li className="user">
                  <button className="dropdown-button" data-activates="user-dropdown">
                    <i className="material-icons left">person</i>
                    <span>{currentUser.username}</span>
                    <i className="material-icons right">arrow_drop_down</i>
                  </button>
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
                    <li><a href={pathFor('users.invite')}>
                      <i className="material-icons left">person_add</i>
                      <span>Invite users</span>
                    </a></li>
                    <li><a href={pathFor('users.bye')} className="logout">
                      <i className="material-icons left">exit_to_app</i>
                      <span>Logout</span>
                    </a></li>
                  </ul>
                </li>
              </ul>
            :
              <ul className="right" key="loggedOutControls">
                <li>
                  <a href={pathFor('users.login')}>
                    Login
                  </a>
                </li>
                {signUp ?
                  <li>
                    <a href={pathFor('users.signup')}>
                      Create Account
                    </a>
                  </li>
                : null}
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
  appTitle: React.PropTypes.string,
  pageTitle: React.PropTypes.string,
  signUp: React.PropTypes.bool,
  model: React.PropTypes.object,
};

export default Navigation;
