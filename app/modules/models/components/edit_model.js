import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import {ListItem} from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import PersonIcon from 'material-ui/svg-icons/social/person';
import PersonAddIcon from 'material-ui/svg-icons/social/person-add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {findIndex, clone} from 'lodash/fp';
import autobind from 'autobind-decorator';
import InputAutocompleteUsers from '../containers/input_autocomplete_users';
import LoadingComponent from '../../core/components/loading';

@autobind
class EditModel extends React.Component {
  static propTypes = {
    // data
    open: PropTypes.bool,
    editModel: PropTypes.bool,
    fields: PropTypes.object,
    // actions
    create: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    // aux
    handleDialog: PropTypes.func.isRequired,
  }

  static defaultProps = {
    fields: {
      title: '',
      description: '',
      members: [],
      permission: 'private',
    },
    open: false,
    saved: false,
    editModel: false,
  }

  constructor(props) {
    super(props);

    const {fields} = this.props;
    this.state = {
      fields,
      busy: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fields: nextProps.fields,
    });
  }

  onSubmit(event) {
    // Because the test cannot get the event argument,
    // so calling preventDefault() on undefined causes an error
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const {fields} = this.state;
    const {editModel, create, update} = this.props;

    if (editModel) {
      update(fields._id, fields);
    } else {
      create(fields);
    }

    this.handleClose();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      fields: Object.assign({}, this.state.fields, {[name]: value}),
    });
  }

  // XXX: Make reusable for all select fields
  handleSelectChange(event, index, value) {
    const name = 'permission';
    this.setState({
      fields: Object.assign({}, this.state.fields, {[name]: value}),
    });
  }

  addMember(newMember) {
    const {fields} = this.state;
    const members = clone(fields.members);

    // don't add existing members
    const index = findIndex(member => (member.username === newMember.name), members);
    if (index > 0) {
      members[index] = Object.assign({}, members[index], {
        removed: false,
      });
    } else {
      members.push({
        userId: newMember.id,
        username: newMember.name,
        isAdmin: false,
        isInvited: newMember.new,
        isConfirmed: true,
      });
    }

    this.setState({
      fields: Object.assign({}, fields, {members}),
    });
  }

  removeMember(index) {
    const {fields} = this.state;
    // If we don't clone, we're mutating the props
    const members = clone(fields.members);
    members[index] = Object.assign({}, members[index], {
      removed: true,
    });
    this.setState({
      fields: Object.assign({}, fields, {members}),
    });
  }

  toggleAdminRights(index) {
    const {fields} = this.state;
    // If we don't clone, we're mutating the props
    const members = clone(fields.members);
    members[index] = Object.assign({}, members[index], {
      isAdmin: !members[index].isAdmin,
    });
    this.setState({
      fields: Object.assign({}, fields, {members}),
    });
  }

  handleClose() {
    const {handleDialog} = this.props;
    handleDialog({edit: false});
  }

  render() {
    const {
      editModel,
      open,
    } = this.props;
    const {busy, fields} = this.state;

    const actions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={editModel ? 'Save' : 'Add model'}
        primary
        keyboardFocused
        onTouchTap={this.onSubmit}
      />,
    ];

    return (
      <Dialog
        title={editModel ? 'Edit model' : 'New model'}
        actions={actions}
        open={open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
      >
        {!busy ?
          <form onSubmit={this.onSubmit}>
            <ListItem disabled>
              <TextField
                floatingLabelText="Title"
                name="title"
                value={fields.title}
                onChange={this.handleInputChange}
                fullWidth
              />
            </ListItem>

            <ListItem disabled>
              <TextField
                floatingLabelText="Description"
                name="description"
                value={fields.description}
                onChange={this.handleInputChange}
                multiLine
                rows={3}
                rowsMax={6}
                fullWidth
              />
            </ListItem>

            <ListItem disabled>
              <SelectField
                floatingLabelText="Visibility"
                name="permission"
                value={fields.permission}
                onChange={this.handleSelectChange}
              >
                <MenuItem value="private" primaryText="Private" />
                <MenuItem value="public" primaryText="Public" />
              </SelectField>

              <IconButton
                tooltip="Private models are visible only to members.
                         Public models can be accessed by everybody with the link."
                tooltipPosition="bottom-center"
              >
                <HelpIcon />
              </IconButton>
            </ListItem>

            {fields.members.map((member, index) => {
              const {userId, username, isInvited, isConfirmed, isAdmin, removed} = member;
              return (!removed &&
                <ListItem
                  disabled
                  key={userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: isInvited || !isConfirmed ? 'rgba(0,0,0,0.05)' : '',
                  }}
                >
                  <Avatar icon={<PersonIcon />} style={{marginRight: 10}} />
                  <div style={{textOverflow: 'ellipsis', flexGrow: 1}}>
                    {username}
                    {isInvited &&
                      <p style={{fontSize: '0.7em', margin: '2px 0 0'}}>
                        An invitation will be send to {username},
                        once you saved the model.
                      </p>
                    }
                    {!isConfirmed &&
                      <p style={{fontSize: '0.7em', margin: '2px 0 0'}}>
                        An invitation was send to {username}.
                      </p>
                    }
                  </div>
                  <div style={{flexShrink: 0}}>
                    <RaisedButton
                      label="Admin"
                      secondary={isAdmin}
                      onTouchTap={() => this.toggleAdminRights(index)}
                    />
                    <RaisedButton
                      icon={<DeleteIcon />}
                      onTouchTap={() => this.removeMember(index)}
                      style={{marginLeft: 10}}
                    />
                  </div>
                </ListItem>
              );
            })}

            <ListItem disabled leftIcon={<Avatar icon={<PersonAddIcon />} />}>
              <InputAutocompleteUsers
                onAdd={this.addMember}
              />
            </ListItem>
          </form>
        :
          <LoadingComponent />
        }
      </Dialog>
    );
  }
}

export default EditModel;
