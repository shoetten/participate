import React from 'react';
import EnsureUserRights from '../../users/containers/ensure_user_rights';

const ModelWrapper = ({content, model}) => (
  <EnsureUserRights model={model} action="view">
    {content()}
  </EnsureUserRights>
);

ModelWrapper.propTypes = {
  content: React.PropTypes.func.isRequired,
  // data
  model: React.PropTypes.object,
  // actions
  setPageTitle: React.PropTypes.func.isRequired,
};

export default ModelWrapper;
