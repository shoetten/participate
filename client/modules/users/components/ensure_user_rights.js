import React from 'react';
import NotFound from '/client/modules/core/components/not_found';

const EnsureUserRights = ({isAllowed, children}) => (
  isAllowed ? children : <NotFound />
);

EnsureUserRights.propTypes = {
  isAllowed: React.PropTypes.bool,
  children: React.PropTypes.element,
};

export default EnsureUserRights;
