import React from 'react';
import EnsureUserRights from '../../users/containers/ensure_user_rights';

class ModelWrapper extends React.Component {
  constructor(props) {
    super(props);

    const {setPageTitle, model} = props;
    // if user is not authorized, there might be no model
    if (model) {
      setPageTitle(model.title);
    }
  }

  componentWillUnmount() {
    const {setPageTitle} = this.props;
    setPageTitle();
  }

  render() {
    const {content, model} = this.props;

    return (
      <EnsureUserRights model={model} action="view">
        {content()}
      </EnsureUserRights>
    );
  }
}

ModelWrapper.propTypes = {
  content: React.PropTypes.func.isRequired,
  // data
  model: React.PropTypes.object,
  // actions
  setPageTitle: React.PropTypes.func.isRequired,
};

export default ModelWrapper;
