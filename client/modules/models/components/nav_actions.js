import React from 'react';
import {pathFor} from '/lib/utils';

const NavActions = ({modelId}) => (
  <ul>
    <li className="model-nav">
      <button className="dropdown-button" href="#" data-activates="model-dropdown">
        <i className="material-icons right">more_vert</i>
      </button>
      <ul id="model-dropdown" className="dropdown-content">
        <li><a href={pathFor('models.edit', {modelId})}>
          <i className="material-icons left">edit</i>
          <span>Edit model</span>
        </a></li>
      </ul>
    </li>
  </ul>
);

NavActions.propTypes = {
  modelId: React.PropTypes.string.isRequired,
};


export default NavActions;
