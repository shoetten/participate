import React from 'react';
import Navigation from './navigation';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {cyan500} from 'material-ui/styles/colors';

const styles = css({
  root: {
    padding: 0,

    '@phone': {
      padding: 20,
    },
  },
});

const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan500,
  },
  appBar: {
    height: 50,
  },
});

const Layout = ({content = () => null }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div className={styles.root}>
      <header>
        <Navigation />
      </header>

      <main>
        {content()}
      </main>

      <footer>
        <small>Built with <a href="https://github.com/kadirahq/mantra">Mantra</a> &amp; Meteor.</small>
      </footer>
    </div>
  </MuiThemeProvider>
);

Layout.propTypes = {
  content: React.PropTypes.func.isRequired,
};

export default Layout;
