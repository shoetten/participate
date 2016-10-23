import React from 'react';
import {pathFor} from '/lib/utils';
import EnsureUserRights from '../../users/containers/ensure_user_rights';

const NavItem = ({href, icon}) => (
  <a href={href}>
    <i className="material-icons">{icon}</i>
  </a>
);

NavItem.propTypes = {
  href: React.PropTypes.string,
  icon: React.PropTypes.string.isRequired,
};


const NavActions = ({model, modelView}) => {
  const modelId = model ? model._id : '';
  const modelSlug = model ? model.slug : '';

  return (
    <ul>
      <li className={modelView === 'help' ? 'active' : ''}>
        {modelView === 'help' && model ?
          <NavItem icon="help" href={pathFor('models.single', {modelId, modelSlug})} />
        :
          <NavItem icon="help" href={pathFor('models.help', {modelId})} />
        }
      </li>

      {model ?
        <EnsureUserRights model={model} action="admin">
          <li className={modelView === 'edit' ? 'active' : ''}>
            {modelView === 'edit' ?
              <NavItem icon="edit" href={pathFor('models.single', {modelId, modelSlug})} />
            :
              <NavItem icon="edit" href={pathFor('models.edit', {modelId: model._id})} />
            }
          </li>
        </EnsureUserRights>
      : null}
    </ul>
  );
};

NavActions.propTypes = {
  model: React.PropTypes.object,
  modelView: React.PropTypes.string,
};

export default NavActions;
