import React from 'react';
import _ from 'lodash';
import ReactTags from 'react-tag-autocomplete';

class InputAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busy: false,
      tags: props.initialTags ? props.initialTags : [],
      suggestions: [],
      classNames: {
        tag: 'ReactTags__tag chip',
        suggestions: 'ReactTags__suggestions dropdown-content',
        isActive: 'selected',
      },
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      // do not suggest already included elements and store them in state
      suggestions: _.differenceWith(newProps.suggestions, this.state.tags, _.isEqual),
    });
  }

  handleDelete(i) {
    const tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags});
  }

  handleAddition(tag) {
    const tags = this.state.tags;

    // since tag names are unique, don't add already existing ones
    if (_.some(tags, ['name', tag.name])) {   // uses the `_.matchesProperty` iteratee shorthand
      return;
    }

    tags.push({
      id: tag.id || _.uniqueId('new_'),
      name: tag.name,
    });
    this.setState({tags});
  }

  handleInputChange(input) {
    const {setQuery} = this.props;
    if (!this.props.busy) {
      setQuery(input);
    }
  }

  render() {
    const {tags, suggestions, classNames} = this.state;
    return (
      <ReactTags
        placeholder="Add new member"
        tags={tags}
        suggestions={suggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        handleInputChange={this.handleInputChange}
        minQueryLength={3}
        classNames={classNames}
      />
    );
  }
}

InputAutocomplete.propTypes = {
  setQuery: React.PropTypes.func.isRequired,
  initialTags: React.PropTypes.object,
  busy: React.PropTypes.bool,
  suggestions: React.PropTypes.array,
};

export default InputAutocomplete;
