import React from 'react';

class Model extends React.Component {
  constructor(props) {
    super(props);
    // bind handlers to this, as suggested in react docs
    this.createPost = this.createPost.bind(this);
  }

  render() {
    return (
      <span>Placehodler</span>
    );
  }
}

export default Model;
