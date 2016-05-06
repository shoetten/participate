import React from 'react';
import {pathFor} from '../../core/libs/helpers';

const NotFound = () => (
  <div>
    <h2>Nothing to see here..</h2>
    <p>
      <a href={pathFor('home')} title="Home">Go back to the homepage..</a>
    </p>
  </div>
);

export default NotFound;
