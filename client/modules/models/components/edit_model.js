import React from 'react';
import $ from 'jquery';
import getSlug from 'speakingurl';
import {pathFor} from '/lib/utils';
import InputAutocompleteUsers from '/client/modules/models/containers/input_autocomplete_users';
import Materialize from 'meteor/poetic:materialize-scss';
// weird export of Materialize
const Material = Materialize.Materialize;

class EditModel extends React.Component {
  constructor(props) {
    super(props);
    this.createModel = this.createModel.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeSlug = this.changeSlug.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changePermission = this.changePermission.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.toggleAdminRights = this.toggleAdminRights.bind(this);
    this.markUnsaved = this.markUnsaved.bind(this);
    this.reset = this.reset.bind(this);
    this.updateSlug = this.updateSlug.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onSlugChange = this.onSlugChange.bind(this);
    this.handleMembersApiCallback = this.handleMembersApiCallback.bind(this);

    const {model} = this.props;
    this.state = {
      slugEdited: false,
      slugValue: model ? model.slug : '',
      members: [],    // state is tracking new members
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
    if (!this.props.modal && nextProps.saved && !this.props.saved) {
      Material.toast('All saved', 10000, 'toast-success');
    }
  }

  componentWillUnmount() {
    $('.material-tooltip').remove();
  }

  onTitleChange() {
    if (!this.props.model) {
      this.updateSlug();
    }
    this.markUnsaved();
  }

  onSlugChange(event) {
    this.markUnsaved();
    const slug = getSlug(event.target.value);
    this.setState({
      slugEdited: slug !== '',
      slugValue: slug,
    });
  }

  updateSlug() {
    if (!this.state.slugEdited) {
      const slug = getSlug(this.titleRef.value);
      this.setState({
        slugValue: slug,
      }, () => {
        Material.updateTextFields();
      });
    }
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
      const {members} = this.state;

      create(
        this.titleRef.value,
        this.slugRef.value,
        this.descRef.value,
        this.permissionRef.checked,
        members
      );
    }
  }

  changeTitle() {
    const {model} = this.props;
    if (model) {
      const {changeTitle} = this.props;
      const newTitle = this.titleRef.value;
      if (model.title !== newTitle) {
        changeTitle(model._id, newTitle);
      }
    }
  }

  changeSlug() {
    const {model} = this.props;
    if (model) {
      const {changeSlug} = this.props;
      const newSlug = this.slugRef.value;
      if (model.slug !== newSlug) {
        changeSlug(model._id, newSlug);
      }
    }
  }

  changeDescription() {
    const {model} = this.props;
    if (model) {
      const {changeDescription} = this.props;
      const newDescription = this.descRef.value;
      if (model.description !== newDescription) {
        changeDescription(model._id, newDescription);
      }
    }
  }

  changePermission() {
    this.markUnsaved();
    const {model} = this.props;
    if (model) {
      const {changePermission} = this.props;
      changePermission(model._id, this.permissionRef.checked);
    }
  }

  addMember(member) {
    this.markUnsaved();
    const {model} = this.props;
    if (model) {
      const {addMember} = this.props;
      addMember(model._id, member[0]);
      this.resetMembersInput();
    }
  }

  removeMember(userId) {
    this.markUnsaved();
    const {model} = this.props;
    if (model) {
      const {removeMember} = this.props;
      removeMember(model._id, userId);
    }
  }

  toggleAdminRights(userId, makeAdmin) {
    this.markUnsaved();
    const {model} = this.props;
    if (model) {
      const {toggleAdminRights} = this.props;
      toggleAdminRights(model._id, userId, makeAdmin);
    }
  }

  markUnsaved() {
    const {saved, markUnsaved} = this.props;
    if (saved) {
      $('.toast-success').remove();
      markUnsaved();
    }
  }

  // XXX: let the HOC handle this, so the api can be called
  // through their reference, e.g. membersRef.reset();
  handleMembersApiCallback(reset) {
    this.resetMembersInput = reset;
  }

  reset(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    this.formRef.reset();
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
        <div className={!modal ? 'text-wrap wide' : ''}>
          {model &&
            <a
              className="close-window"
              title="Back to model"
              href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}
            >
              <i className="material-icons">close</i>
            </a>
          }

          <form
            ref={c => (this.formRef = c)}
            className="edit-model modal-content"
            onSubmit={this.createModel}
          >
            <div className="row">
              {!model ?
                <h4>New model</h4>
              :
                <h1>
                  <i className="material-icons left">edit</i>
                  Edit model
                  <i
                    className="material-icons tooltipped help"
                    data-tooltip="Changes are saved automagically."
                    data-position="right"
                  >
                    help
                  </i>
                </h1>
              }

              {error && modal ? <p className="error">
                <i className="material-icons left">error_outline</i>
                {error}
              </p> : null}
            </div>

            <div className="row">
              <div className="input-field col s12 m8 l6">
                <input
                  id="title" ref={c => (this.titleRef = c)} type="text" className="validate"
                  defaultValue={model ? model.title : ''}
                  onChange={this.onTitleChange}
                  onBlur={this.changeTitle}
                />
                <label htmlFor="title">Title</label>
              </div>
              <div className="input-field col s12 m8 l6">
                <input
                  id="slug" ref={c => (this.slugRef = c)} type="text" className="validate"
                  value={this.state.slugValue} onChange={this.onSlugChange}
                  onBlur={this.changeSlug}
                />
                <label htmlFor="slug">Slug</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <textarea
                  id="description" ref={c => (this.descRef = c)}
                  className="materialize-textarea validate"
                  defaultValue={model ? model.description : ''}
                  onChange={this.markUnsaved}
                  onBlur={this.changeDescription}
                />
                <label htmlFor="description">Description</label>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="switch left">
                  <label htmlFor="permission">
                    Private
                    <input
                      id="permission"
                      type="checkbox" ref={c => (this.permissionRef = c)}
                      defaultChecked={model && model.permission === 'public'}
                      onChange={this.changePermission}
                    />
                    <span className="lever" />
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
                            onClick={() => this.toggleAdminRights(member.userId, !member.isAdmin)}
                          >
                            Admin
                          </button>
                          <button
                            className="waves-effect waves-light btn remove tooltipped"
                            data-tooltip="Remove member"
                            onClick={() => this.removeMember(member.userId)}
                          >
                            <i className="material-icons">delete</i>
                          </button>
                        </div>
                      </li>
                    ))}
                    <li className="collection-item avatar">
                      <InputAutocompleteUsers
                        exposeApiCallback={this.handleMembersApiCallback}
                        onChange={member => this.addMember(member)}
                      />
                    </li>
                  </ul>
                :
                  <InputAutocompleteUsers
                    exposeApiCallback={this.handleMembersApiCallback}
                    onChange={members => this.setState({members})}
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
      </div>
    );
  }
}

EditModel.propTypes = {
  // data
  model: React.PropTypes.object,
  // actions
  create: React.PropTypes.func.isRequired,
  changeTitle: React.PropTypes.func,
  changeSlug: React.PropTypes.func,
  changeDescription: React.PropTypes.func,
  changePermission: React.PropTypes.func,
  addMember: React.PropTypes.func,
  removeMember: React.PropTypes.func,
  toggleAdminRights: React.PropTypes.func,
  markUnsaved: React.PropTypes.func,
  clearErrors: React.PropTypes.func,
  // aux
  saved: React.PropTypes.bool,
  error: React.PropTypes.string,
  modal: React.PropTypes.bool,    // Is the component displayed in material modal?
};

export default EditModel;
