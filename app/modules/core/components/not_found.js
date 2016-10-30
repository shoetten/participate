import React from 'react';
import {pathFor} from '/lib/utils';

const NotFound = () => (
  <div className="not-found">
    <div className="text-wrap">
      <h1>
        <i className="material-icons left">explore</i>
        404 - Not Found
      </h1>
      <p>
        There&#039;s nothing here for you.
        Maybe go <a href={pathFor('home')} title="Home">back to the homepage..?</a>
      </p>
    </div>
  </div>
);

export default NotFound;
