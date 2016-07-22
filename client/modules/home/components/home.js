import React from 'react';
import {pathFor} from '/lib/utils';

const Home = () => (
  <div className="home model-backdrop">
    <div className="brand">
      <h1>Welcome to Participate</h1>
      <p>Online participatory modelling made easy..</p>
    </div>
    <a href={pathFor('imprint')} title="Impressum" className="imprint">Impressum</a>
  </div>
);

export default Home;
