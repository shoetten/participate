import React from 'react';

import Navigation from '../containers/navigation';

class MainLayout extends React.Component {
  render() {
    const {content, NavActions, model} = this.props;

    return (
      <div>
        <header>
          <Navigation>
            {NavActions ? <NavActions model={model} /> : null}
          </Navigation>
        </header>

        <main>
          {/* container for materialize css toasts */}
          <div id="toast-container"></div>
          {/* main content renders here */}
          {model ? content(model) : content()}
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
  model: React.PropTypes.object,
};

export default MainLayout;
