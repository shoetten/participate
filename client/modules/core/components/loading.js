import React from 'react';
import Loading from 'react-loading';

const LoadingComponent = () => (
  <div className="loading">
    <Loading type="balls" color="inherit" delay={500} />
  </div>
);

export default LoadingComponent;
