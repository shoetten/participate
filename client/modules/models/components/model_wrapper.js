import React from 'react';

class ModelWrapper extends React.Component {
  constructor(props) {
    super(props);

    const {setPageTitle, model} = props;
    // if user is not authorized, there might be no model
    if (model) {
      setPageTitle(model.title);
    }
  }

  render() {
    const {content, model} = this.props;

    return content(model);
  }
}

ModelWrapper.propTypes = {
  content: React.PropTypes.func.isRequired,
  // data
  model: React.PropTypes.object.isRequired,
  // actions
  setPageTitle: React.PropTypes.func.isRequired,
};

export default ModelWrapper;
