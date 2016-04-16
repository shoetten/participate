import React from 'react';

const Navigation = ({children}) => (
  <div className="navbar-fixed">
    <nav>
      <div className="nav-wrapper">
        <span className="brand-logo left">Participate!</span>
        {children}
      </div>
    </nav>
  </div>
);

Navigation.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default Navigation;
