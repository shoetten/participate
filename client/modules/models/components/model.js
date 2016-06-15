import React from 'react';

class Model extends React.Component {
  constructor(props) {
    super(props);

    const {setPageTitle, model} = this.props;
    setPageTitle(model.title);
  }

  render() {
    return (
      <span>Placehodler</span>
    );
  }
}

Model.propTypes = {
  setPageTitle: React.PropTypes.func.isRequired,
  model: React.PropTypes.object.isRequired,
};

export default Model;
