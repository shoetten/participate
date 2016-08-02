import React from 'react';
import Navigation from '../containers/navigation';

const MainLayout = ({content, NavActions, model, modelView}) => (
  <div>
    <header>
      <Navigation model={model}>
        {NavActions ? <NavActions model={model} modelView={modelView} /> : null}
      </Navigation>

      {/* container for materialize css toasts */}
      <div id="toast-container" />
    </header>

    <main>
      {/* main content renders here */}
      {model ? content(model) : content()}
    </main>
  </div>
);

MainLayout.propTypes = {
  content: React.PropTypes.func.isRequired,
  NavActions: React.PropTypes.func,
  model: React.PropTypes.object,
  modelView: React.PropTypes.string,
};

export default MainLayout;
