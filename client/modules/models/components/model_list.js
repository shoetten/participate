import React from 'react';
import $ from 'jquery';
import {pathFor} from '/lib/utils';
import EditModel from '../containers/edit_model';
import EnsureLoggedIn from '../../users/containers/ensure_logged_in';

class ModelList extends React.Component {
  constructor(props) {
    super(props);
    this.showModelDialog = this.showModelDialog.bind(this);
  }

  showModelDialog(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    $('#new-model').openModal();
  }

  render() {
    const {models} = this.props;

    return (
      <EnsureLoggedIn>
        <div className="modellist">
          {models.length > 0 ?
            <div className="row">
              {models.map(model => (
                <section key={model._id} className="col s12 m4 l3">
                  <div className="card small model">
                    <a
                      className="card-image waves-effect waves-block waves-light"
                      href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}
                    >
                      <img alt={model.title} src="/images/model-example-thumb.png" />
                    </a>
                    <div className="card-content">
                      <a title="Show details" className="activator right">
                        <i className="material-icons">arrow_drop_up</i>
                      </a>
                      <h2 className="card-title">
                        <a href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}>
                          {model.title}
                        </a>
                      </h2>
                      <div className="activator">
                        <time className="lastModified" title="Last modified">
                          <i className="material-icons">update</i>
                          {/* XXX: use proper localization */}
                          {model.modifiedAt.toLocaleString()}
                        </time>
                      </div>
                    </div>
                    <div className="card-reveal">
                      <div className="content">
                        <h2 className="card-title">
                          {model.title}
                          <i className="material-icons right">close</i>
                        </h2>
                        <p>{model.description}</p>
                        <p>
                          {model.members.map(member => (
                            // XXX: Link to public profile
                            // and display some additional info on hover
                            <a key={member.userId} href="#" className="chip member">
                              {member.username}
                            </a>
                          ))}
                        </p>
                      </div>
                      <div className="card-action">
                        <a href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}>
                          Go to model
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          :
            <div className="nothing-found">
              <div className="text">
                <h1>You're not modelling anything, yet..</h1>
                <p>Let a friend invite you to an existing model, or..</p>
              </div>
              <div className="arrow"><span>..create a new one!</span></div>
            </div>
          }

          <a
            className="btn-floating btn-large waves-effect waves-light new"
            href="#new-model"
            onClick={this.showModelDialog}
          >
            <i className="material-icons">add</i>
          </a>

          <EditModel />
        </div>
      </EnsureLoggedIn>
    );
  }
}

ModelList.propTypes = {
  models: React.PropTypes.array.isRequired,
};

export default ModelList;
