import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import {differenceWith, isEqual, some, uniqueId} from 'lodash/fp';

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

  componentWillMount() {
    // Expose all public API functions here.
    // For more info, see
    // https://medium.com/@erikras/the-hoc-drill-pattern-a676a3889ced
    this.props.exposeApiCallback(
      this.reset.bind(this)
    );
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      // do not suggest already included elements and store them in state
      suggestions: differenceWith(isEqual, newProps.suggestions, this.state.tags),
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
    if (some(['name', tag.name], tags)) {   // uses the `_.matchesProperty` iteratee shorthand
      return;
    }

    tags.push({
      id: tag.id || uniqueId('new_'),
      name: tag.name,
    });
    this.setState({tags});
    this.props.onChange(tags);
  }

  handleInputChange(input) {
    const {setQuery} = this.props;
    if (!this.props.busy) {
      setQuery(input);
    }
  }

  reset() {
    this.setState({
      tags: [],
      suggestions: [],
    });
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
        autofocus={false}
        classNames={classNames}
        allowNew
      />
    );
  }
}

InputAutocomplete.propTypes = {
  exposeApiCallback: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  setQuery: React.PropTypes.func.isRequired,
  initialTags: React.PropTypes.array,
  busy: React.PropTypes.bool,
  suggestions: React.PropTypes.array,
};

export default InputAutocomplete;
