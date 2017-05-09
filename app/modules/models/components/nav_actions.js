import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {ToolbarGroup} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import EditIcon from 'material-ui/svg-icons/image/edit';
import {pathFor} from '/lib/utils';
import EnsureUserRights from '../../users/containers/ensure_user_rights';

@autobind
class NavActions extends React.Component {
  openEditDialog() {
    const {handleDialog} = this.props;
    handleDialog({edit: true});
  }

  render() {
    const {model, modelView} = this.props;
    const modelId = model ? model._id : '';
    const modelSlug = model ? model.slug : '';

    return (
      <ToolbarGroup>
        {modelView === 'help' && model ?
          <IconButton
            href={pathFor('models.single', {modelId, modelSlug})}
            tooltip="Back to model"
            style={{backgroundColor: 'rgba(0,0,0,0.2)'}}
            tooltipPosition="bottom-center"
          >
            <HelpIcon />
          </IconButton>
        :
          <IconButton
            href={pathFor('models.help', {modelId})}
            tooltip="Help"
            tooltipPosition="bottom-center"
          >
            <HelpIcon />
          </IconButton>
        }

        {!!model &&
          <EnsureUserRights model={model} action="admin">
            <IconButton
              onTouchTap={this.openEditDialog}
              tooltip="Edit"
              tooltipPosition="bottom-center"
            >
              <EditIcon />
            </IconButton>
          </EnsureUserRights>
        }
      </ToolbarGroup>
    );
  }
}

NavActions.propTypes = {
  model: PropTypes.object,
  modelView: PropTypes.string,
  // actions
  handleDialog: PropTypes.func.isRequired,
};

NavActions.defaultProps = {
  model: null,
  modelView: '',
};

export default NavActions;
