import React from 'react';
import Navigation from './navigation';

class Layout extends React.Component {
  render() {
    const {
      content,
      NavActions,
    } = this.props;

    return (
      <div>
        <header>
          <Navigation>
            <NavActions />
          </Navigation>
        </header>

        <main>
          {content()}
        </main>

        <footer>

        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
  content: React.PropTypes.func.isRequired,
  NavActions: React.PropTypes.func,
};

export default Layout;
