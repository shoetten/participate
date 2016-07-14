import React from 'react';
import $ from 'jquery';
import Materialize from 'meteor/poetic:materialize-scss';
// weird export of Materialize
const Material = Materialize.Materialize;
import getSlug from 'speakingurl';

import InputAutocompleteUsers from '../containers/input_autocomplete_users';

class EditModel extends React.Component {
  constructor(props) {
    super(props);
    this.createModel = this.createModel.bind(this);
    this.reset = this.reset.bind(this);
    this.updateSlug = this.updateSlug.bind(this);
    this.onSlugChange = this.onSlugChange.bind(this);
    this.handleMembersApiCallback = this.handleMembersApiCallback.bind(this);

    const {model} = this.props;
    this.state = {
      slugEdited: false,
      slugValue: model ? model.slug : '',
      newMembers: [],    // state is tracking new members
    };
  }

  componentDidMount() {
    const {model} = this.props;

    $('.tooltipped').tooltip({delay: 30});
    // XXX: HTML in materialize tooltips. This hack should be removed, once
    // materialize css comes up with something better, see
    // https://github.com/Dogfalo/materialize/issues/1537
    $('.tooltipped').each((index, el) => {
      const span = $(`#${$(el).attr('data-tooltip-id')} > span:first-child`);
      const html = $(el).find('.tooltipped-content').html() || $(el).attr('data-tooltip');
      span.before(html);
      span.remove();
    });

    if (model) {
      Material.updateTextFields();
    }
  }

  componentWillReceiveProps(nextProps) {
    // Use toasts for error messages, when not in modal view
    if (!this.props.modal && nextProps.error !== this.props.error) {
      // display error for 5 seconds
      Material.toast(nextProps.error, 5000, 'toast-error');
    }
  }

  componentWillUnmount() {
    $('.material-tooltip').remove();
  }

  onSlugChange(event) {
    const slug = getSlug(event.target.value);
    this.setState({
      slugEdited: slug !== '',
      slugValue: slug,
    });
  }

  updateSlug() {
    if (!this.state.slugEdited) {
      const {titleRef} = this.refs;
      const slug = getSlug(titleRef.value);
      this.setState({
        slugValue: slug,
      }, () => {
        Material.updateTextFields();
      });
    }
  }

  // XXX: let the HOC handle this, so the api can be called
  // through their reference, e.g. membersRef.reset();
  handleMembersApiCallback(reset) {
    this.resetMembersInput = reset;
  }

  createModel(event) {
    // Because the test cannot get the event argument,
    // so calling preventDefault() on undefined causes an error
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    // This doesn't do anything when a model is edited.
    const {model} = this.props;
    if (!model) {
      const {create} = this.props;
      const {titleRef, slugRef, descRef, permissionRef} = this.refs;
      const {newMembers} = this.state;

      create(titleRef.value, slugRef.value, descRef.value, permissionRef.checked, newMembers);
    }
  }

  reset(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const {formRef} = this.refs;
    formRef.reset();
    this.resetMembersInput();

    const {clearErrors} = this.props;
    clearErrors();
  }

  render() {
    const {
      error,
      modal = true,
      model,
    } = this.props;

    return (
      <div id={!model ? 'new-model' : 'edit-model'} className={modal ? 'modal bottom-sheet' : ''}>
        <form ref="formRef" className="edit-model modal-content" onSubmit={this.createModel}>
          <div className="row">
            {!model ?
              <h4>New model</h4>
            :
              <h4>
                Edit model
                <i
                  className="material-icons tooltipped help"
                  data-tooltip="Changes are saved automagically."
                  data-position="right"
                >
                  help
                </i>
              </h4>
            }

            {error && modal ? <p className="error">
              <i className="material-icons left">error_outline</i>
              {error}
            </p> : null}
          </div>

          <div className="row">
            <div className="input-field col s12 m8 l6">
              <input
                id="title" ref="titleRef" type="text" className="validate"
                defaultValue={model ? model.title : ''}
                onChange={this.updateSlug}
              />
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s12 m8 l6">
              <input
                id="slug" ref="slugRef" type="text" className="validate"
                value={this.state.slugValue} onChange={this.onSlugChange}
              />
              <label htmlFor="slug">Slug</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <textarea
                id="description" ref="descRef"
                className="materialize-textarea validate"
                defaultValue={model ? model.description : ''}
              />
              <label htmlFor="description">Description</label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="switch left">
                <label>
                  Private
                  <input
                    type="checkbox" ref="permissionRef"
                    defaultChecked={model && model.permission === 'public'}
                  />
                  <span className="lever"></span>
                  Public
                </label>
              </div>
              <i className="material-icons tooltipped help" data-position="right">
                help
                <div className="tooltipped-content">
                  Private models are visible only to members.<br />
                  Public models can be accessed by everybody with the link.
                </div>
              </i>
            </div>
          </div>

          <div className="row">
            <div className="col s12">
              {model ?
                <ul className="collection">
                  {model.members.map((member) => (
                    <li
                      key={member.userId}
                      className={`collection-item avatar${member.isAdmin ? ' admin' : ''}`}
                    >
                      <i className="material-icons circle">person</i>
                      <span className="title">{member.username}</span>
                      <p>Joined on {member.joined.toLocaleString()}</p>

                      <div className="secondary-content">
                        <button
                          className="waves-effect waves-light btn admin tooltipped"
                          data-tooltip={member.isAdmin ? 'Revoke admin' : 'Make admin'}
                        >
                          Admin
                        </button>
                        <button
                          className="waves-effect waves-light btn remove tooltipped"
                          data-tooltip="Remove member"
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </div>
                    </li>
                  ))}
                  <li className="collection-item avatar">
                    <InputAutocompleteUsers
                      exposeApiCallback={this.handleMembersApiCallback}
                      onChange={(newMembers) => this.setState({newMembers})}
                    />
                  </li>
                </ul>
              :
                <InputAutocompleteUsers
                  exposeApiCallback={this.handleMembersApiCallback}
                  onChange={(newMembers) => this.setState({newMembers})}
                />
              }
            </div>
          </div>

          {!model ?
            <div className="modal-footer">
              <button type="submit" className="btn waves-effect waves-light">
                <i className="material-icons left">add</i>
                Add Model
              </button>
              <button
                type="reset" onClick={this.reset}
                className="btn-flat modal-action modal-close waves-effect waves-light"
              >
                {modal ? 'Cancel' : 'Reset'}
              </button>
            </div>
            : null
          }

        </form>
      </div>
    );
  }
}

EditModel.propTypes = {
  // data
  model: React.PropTypes.object,
  // actions
  create: React.PropTypes.func.isRequired,
  edit: React.PropTypes.func,
  error: React.PropTypes.string,
  clearErrors: React.PropTypes.func,
  // is the component displayed in material modal
  modal: React.PropTypes.bool,
};

export default EditModel;
