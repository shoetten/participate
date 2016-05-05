import {Meteor} from 'meteor/meteor';
import React from 'react';

class Bye extends React.Component {
  componentWillMount() {
    Meteor.logout();
  }

  render() {
    return (
      <div>
        <h2>Bye</h2>
        <p>Hope to see you soon!</p>
      </div>
    );
  }
}

export default Bye;
