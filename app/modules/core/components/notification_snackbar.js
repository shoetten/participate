import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import Snackbar from 'material-ui/Snackbar';
import ErrorIcon from 'material-ui/svg-icons/alert/error-outline';
import {orange400} from 'material-ui/styles/colors';

@autobind
class NotificationSnackbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {message, error} = this.props;
    if ((nextProps.message && nextProps.message !== message)
        || (nextProps.error && nextProps.error !== error)) {
      this.setState({open: true});
    }
  }

  close() {
    this.setState({
      open: false,
    });
    this.props.clearErrors();
  }

  render() {
    const {message, error, duration} = this.props;
    const msg =
      message ||
      <span><ErrorIcon style={{verticalAlign: 'middle'}} color={orange400} /> {error}</span>;
    return (
      <Snackbar
        open={this.state.open}
        message={msg}
        autoHideDuration={duration}
        onRequestClose={this.close}
      />
    );
  }
}

NotificationSnackbar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  error: PropTypes.string,
  duration: PropTypes.number,
  // actions
  clearErrors: PropTypes.func.isRequired,
};

NotificationSnackbar.defaultProps = {
  open: false,
  message: '',
  error: '',
  duration: 3000,
};

export default NotificationSnackbar;
