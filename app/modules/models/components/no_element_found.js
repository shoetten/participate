import React from 'react';

const NoElementFound = ({children, arrowText}) => (
  <div className="no-element-found">
    <div className="text">
      {children}
    </div>
    <div className="arrow"><span>{arrowText}</span></div>
  </div>
);

NoElementFound.propTypes = {
  children: React.PropTypes.node,
  arrowText: React.PropTypes.string,
};

NoElementFound.defaultProps = {
  children: <h1>Nothing found, so..</h1>,
  arrowText: '..create a new one!',
};

export default NoElementFound;
