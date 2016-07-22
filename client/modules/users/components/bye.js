import {Meteor} from 'meteor/meteor';
import React from 'react';

class Bye extends React.Component {
  componentWillMount() {
    Meteor.logout();
  }

  render() {
    return (
      <div className="logged-out">
        <div className="text-wrap">
          <h2>Bye</h2>
          <p>Hope to see you soon!</p>
        </div>
      </div>
    );
  }
}

export default Bye;
