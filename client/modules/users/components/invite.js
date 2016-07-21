import React from 'react';
import update from 'react-addons-update';
import Materialize from 'meteor/poetic:materialize-scss';
// weird export of Materialize
const Material = Materialize.Materialize;
import {pathFor} from '/lib/utils';
import LoadingComponent from '../../core/components/loading';

class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.inviteUsers = this.inviteUsers.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);

    this.state = {
      emails: [''],
    };
  }

  componentWillReceiveProps(nextProps) {
    // Use toasts for error messages, when not in modal view
    if (nextProps.error !== this.props.error) {
      // display error for 5 seconds
      Material.toast(nextProps.error, 5000, 'toast-error');
    }
    if (!nextProps.loading && this.props.loading) {
      if (!nextProps.error) {
        Material.toast('Successfully invited!', 5000, 'toast-success');
      }
      this.setState({emails: ['']});
    }
  }

  onEmailChange(event, index) {
    const input = event.target.value;
    const {emails} = this.state;
    const newEmails = update(emails, {[index]: {$set: input}}).filter((email, i) => (
      i === emails.length - 1 || !!email
    ));
    if (index === emails.length - 1) newEmails.push('');
    this.setState({emails: newEmails});
  }

  inviteUsers(event) {
    if (event) event.preventDefault();

    const {inviteUsers} = this.props;
    const emails = this.state.emails.filter(Boolean);
    if (emails.length > 0) {
      inviteUsers(emails);
    }
  }

  render() {
    const {emails} = this.state;
    const {loading} = this.props;

    return (
      <div className="invite model-backdrop">
        <div className="text-wrap block">
          <h1><i className="material-icons left">person_add</i>Invite users</h1>
          <p>
            You know somebody who could be interested in trying this app out?
            Great! You can invite as many people as you like.
            If you want to directly add them to an existing model, use
            the <a href={pathFor('models.new')} title="Create new model">new</a> or
            edit model dialog instead.
          </p>

          <form ref="formRef" onSubmit={this.inviteUsers}>
            <div className="row">
              {!loading ?
                emails.map((email, i) => (
                  <div className="input-field col s12 m6" key={i}>
                    <input
                      id={`email${i}`} type="email" className="validate"
                      value={email}
                      onChange={(event) => this.onEmailChange(event, i)}
                    />
                    <label htmlFor={`email${i}`}>Email</label>
                  </div>
                ))
              :
                <LoadingComponent />
              }
            </div>

            <button
              type="submit" disabled={loading}
              className="btn waves-effect waves-light right"
            >
              <i className="material-icons left">send</i>
              Send invite{emails.filter(Boolean).length > 1 ? 's' : ''}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

Invite.propTypes = {
  // actions
  inviteUsers: React.PropTypes.func.isRequired,
  // aux
  loading: React.PropTypes.bool,
  error: React.PropTypes.string,
};

export default Invite;
