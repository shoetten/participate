import React from 'react';
import $ from 'jquery';
import {pathFor} from '../../core/libs/helpers';
import NewModel from '../containers/new_model';

class ModelList extends React.Component {
  constructor(props) {
    super(props);
    this.showModelDialog = this.showModelDialog.bind(this);
  }

  showModelDialog(event) {
    // Becaus the test cannot get event argument
    // so call preventDefault() on undefined cause an error
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    $('#new-model').openModal();
  }

  render() {
    return (
      <div className="modellist">
        <div className="row">
          {this.props.models.map(model => (
            <section key={model._id} className="btn col s12 m4 l3">
              <a href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}>
                {model.title}
              </a>
              <footer>: {model.modifiedAt}</footer>
            </section>
          ))}
          <section className="col s12 m4 l3">
            <a className="btn waves-effect waves-light new" href="#new-model" onClick={this.showModelDialog}>
              <i className="material-icons large">add_circle</i>
            </a>
          </section>
        </div>

        <NewModel />
      </div>
    );
  }
}

ModelList.propTypes = {
  models: React.PropTypes.array.isRequired,
};

export default ModelList;
