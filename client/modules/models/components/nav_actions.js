import React from 'react';
import EnsureUserRights from '/client/modules/users/containers/ensure_user_rights';
import {pathFor} from '/lib/utils';

const NavActions = ({model, modelView}) => (
  <ul>
    <EnsureUserRights model={model} action="admin">
      <li className={modelView === 'edit' ? 'active' : ''}>
        {modelView === 'edit' ?
          <a href={pathFor('models.single', {modelId: model._id, modelSlug: model.slug})}>
            <i className="material-icons">edit</i>
          </a>
        :
          <a href={pathFor('models.edit', {modelId: model._id})}>
            <i className="material-icons">edit</i>
          </a>
        }

      </li>
    </EnsureUserRights>
  </ul>
);

NavActions.propTypes = {
  model: React.PropTypes.object.isRequired,
  modelView: React.PropTypes.string,
};

export default NavActions;
