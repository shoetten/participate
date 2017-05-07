import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';

const LoadingComponent = ({size, thickness, style}) => (
  <CircularProgress size={size} thickness={thickness} style={style} />
);

LoadingComponent.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
  style: PropTypes.object,
};
LoadingComponent.defaultProps = {
  size: 60,
  thickness: 7,
  style: {display: 'block', margin: '0 auto'},
};

export default LoadingComponent;
