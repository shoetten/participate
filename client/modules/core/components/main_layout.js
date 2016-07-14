import React from 'react';

import Navigation from '../containers/navigation';

class MainLayout extends React.Component {
  render() {
    const {content, NavActions} = this.props;

    return (
      <div>
        <header>
          <Navigation>
            {NavActions ? <NavActions /> : null}
          </Navigation>
        </header>

        <main>
          {/* container for materialize css toasts */}
          <div id="toast-container"></div>
          {/* main content renders here */}
          {content()}
        </main>

        <footer>

        </footer>
      </div>
    );
  }
}

MainLayout.propTypes = {
  content: React.PropTypes.func.isRequired,
  NavActions: React.PropTypes.func,
};

export default MainLayout;
