import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {uniqueId} from 'lodash/fp';
import AutoComplete from 'material-ui/AutoComplete';

const dataSourceConfig = {
  text: 'name',
  value: 'id',
};

@autobind
class InputAutocomplete extends React.Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    setQuery: PropTypes.func.isRequired,
    suggestions: PropTypes.array,
  }

  static defaultProps = {
    suggestions: [],
  }

  constructor(props) {
    super(props);
    this.id = uniqueId();
    this.state = {
      searchText: '',
    };
  }

  handleUpdateInput(searchText) {
    this.setState({searchText});
    const {setQuery} = this.props;
    setQuery(searchText);
  }

  handleNewRequest(selected, index) {
    const {onAdd, setQuery} = this.props;
    this.setState({
      searchText: '',
    });
    onAdd({
      id: index > -1 ? selected.id : uniqueId('new_'),
      name: index > -1 ? selected.name : selected,
      new: index === -1,
    });
    setQuery('');
  }

  render() {
    const {suggestions} = this.props;
    const {searchText} = this.state;
    return (
      <AutoComplete
        id={this.id}
        filter={AutoComplete.noFilter}
        searchText={searchText}
        onUpdateInput={this.handleUpdateInput}
        onNewRequest={this.handleNewRequest}
        dataSource={suggestions}
        dataSourceConfig={dataSourceConfig}
        openOnFocus
        fullWidth
      />
    );
  }
}

export default InputAutocomplete;
