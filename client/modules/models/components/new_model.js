import React from 'react';

class NewModel extends React.Component {
  constructor(props) {
    super(props);
    this.createModel = this.createModel.bind(this);
  }

  createModel(event) {
    // Becaus the test cannot get event argument
    // so call preventDefault() on undefined cause an error
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const {create} = this.props;
    const {titleRef, descRef} = this.refs;

    create(titleRef.value, descRef.value);
  }

  render() {
    const {error, clearErrors} = this.props;
    return (
      <div id="new-model" className="modal bottom-sheet">
        <form className="new-model modal-content" onSubmit={this.createModel}>
          <div className="row">
            <h4>New Model</h4>

            {error ? <p className="error">
              <i className="material-icons left">error_outline</i>
              {error}
            </p> : null}
          </div>

          <div className="row">
            <div className="input-field col s12 m8 l6">
              <input id="title" ref="titleRef" type="text" className="validate" />
              <label htmlFor="title">Title</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <textarea id="description" ref="descRef" className="materialize-textarea" />
              <label htmlFor="description">Description</label>
            </div>
          </div>
          <div className="row">
            <div className="switch">
              <label>
                Private
                <input type="checkbox" ref="permissionRef" />
                <span className="lever"></span>
                Public
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn waves-effect waves-light">
              <i className="material-icons left">add</i>
              Add Model
            </button>
            <button type="reset" onClick={clearErrors} className="btn-flat modal-action modal-close waves-effect waves-light">
              Cancel
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
};

export default NewModel;
