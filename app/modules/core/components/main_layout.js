import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Navigation from '../containers/navigation';
import NotificationSnackbar from '../../core/containers/notification_snackbar';

const styles = {
  root: {
    position: 'relative',
    padding: '0 12px 12px',
  },
};

const MainLayout = ({content, classes, NavActions, model, modelView, msg, error}) => (
  <MuiThemeProvider>
    <div>
      <header>
        <Navigation model={model}>
          {NavActions ? <NavActions model={model} modelView={modelView} /> : null}
        </Navigation>
      </header>

      <main className={classes.root}>
        {/* main content renders here */}
        {model ? content(model) : content()}
      </main>

      <NotificationSnackbar message={msg} error={error} />
    </div>
  </MuiThemeProvider>
);

MainLayout.propTypes = {
  content: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  NavActions: PropTypes.func,
  model: React.PropTypes.object,
  modelView: React.PropTypes.string,
  // aux
  msg: PropTypes.string,
  error: PropTypes.string,
};

MainLayout.defaultProps = {
  NavActions: null,
  msg: '',
  error: '',
};

export default injectSheet(styles)(MainLayout);
