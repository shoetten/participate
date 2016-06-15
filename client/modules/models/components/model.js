import React from 'react';
import EnsureLoggedIn from '../../users/containers/ensure_logged_in';

class Model extends React.Component {
  constructor(props) {
    super(props);

    const {setPageTitle, model} = this.props;
    // if user is not authorized, there might be no model
    if (model) {
      setPageTitle(model.title);
    }
  }

  render() {
    return (
      <EnsureLoggedIn>
        <span>Placehodler</span>
      </EnsureLoggedIn>
    );
  }
}

Model.propTypes = {
  setPageTitle: React.PropTypes.func.isRequired,
  model: React.PropTypes.object.isRequired,
};

export default Model;
