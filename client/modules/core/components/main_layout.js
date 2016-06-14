import React from 'react';
import {Meteor} from 'meteor/meteor';
import {DocHead} from 'meteor/kadira:dochead';

import Navigation from '../containers/navigation';

class Layout extends React.Component {
  componentDidMount() {
    DocHead.setTitle(Meteor.settings.public.appName);
    DocHead.addMeta({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    });
  }

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
