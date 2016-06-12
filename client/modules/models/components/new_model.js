import React from 'react';
import $ from 'jquery';
import getSlug from 'speakingurl';

import InputAutocompleteUsers from '../containers/input_autocomplete_users';

class NewModel extends React.Component {
  constructor(props) {
    super(props);
    this.createModel = this.createModel.bind(this);
    this.reset = this.reset.bind(this);
    this.updateSlug = this.updateSlug.bind(this);
    this.onSlugChange = this.onSlugChange.bind(this);

    this.state = {
      slugEdited: false,
      slugValue: '',
      members: [],
    };
  }

  componentDidMount() {
    $('.tooltipped').tooltip({delay: 50});
    // XXX: HTML in materialize tooltips. This hack should be removed, once
    // materialize css comes up with something better, here
    // https://github.com/Dogfalo/materialize/issues/1537
    $('.tooltipped').each((index, element) => {
      const span = $(`#${$(element).attr('data-tooltip-id')} > span:first-child`);
      span.before($(element).find('.tooltipped-content').html());
      span.remove();
    });
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
        // XXX: Use with a proper import..
        Materialize.updateTextFields();
      });
    }
  }

  createModel(event) {
    // Becaus the test cannot get event argument
    // so call preventDefault() on undefined cause an error
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const {create} = this.props;
    const {titleRef, slugRef, descRef, permissionRef} = this.refs;
    const {members} = this.state;

    create(titleRef.value, slugRef.value, descRef.value, permissionRef.checked, members);
  }

  reset(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const {formRef} = this.refs;
    formRef.reset();
    // XXX: The members ref does not reference the underlying component,
    // but the react komposer container. Therefore the public component API
    // is not accesible via the membersRef.
    // membersRef.reset();

    const {clearErrors} = this.props;
    clearErrors();
  }

  render() {
    const {
      error,
      modal = true,
    } = this.props;

    return (
      <div id="new-model" className={modal ? 'modal bottom-sheet' : ''}>
        <form ref="formRef" className="new-model modal-content" onSubmit={this.createModel}>
          <div className="row">
            <h4>New Model</h4>

            {error ? <p className="error">
              <i className="material-icons left">error_outline</i>
              {error}
            </p> : null}
          </div>

          <div className="row">
            <div className="input-field col s12 m8 l6">
              <input
                id="title" ref="titleRef" type="text" className="validate"
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
              <textarea id="description" ref="descRef" className="materialize-textarea validate" />
              <label htmlFor="description">Description</label>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="switch left">
                <label>
                  Private
                  <input type="checkbox" ref="permissionRef" />
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
            <div className="col">
              <InputAutocompleteUsers
                ref="membersRef"
                onChange={(members) => this.setState({members})}
              />
            </div>
          </div>

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
        </form>
      </div>
    );
  }
}

NewModel.propTypes = {
  create: React.PropTypes.func.isRequired,
  error: React.PropTypes.string,
  clearErrors: React.PropTypes.func,
  // is the component displayed in material modal
  modal: React.PropTypes.bool,
};

export default NewModel;
