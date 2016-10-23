import React from 'react';

const EnsureUserRights = ({isAllowed, children}) => (
  isAllowed ? children : null
);

EnsureUserRights.propTypes = {
  isAllowed: React.PropTypes.bool,
  children: React.PropTypes.element,
};

export default EnsureUserRights;
