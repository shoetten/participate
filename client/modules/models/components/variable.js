import React from 'react';
import clickDrag from 'react-clickdrag';

class Variable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dimensions: {w: 100, h: 30},
    };
  }

  componentDidMount() {
    this.calcDimensions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.name !== this.props.name) {
      this.calcDimensions();
    }
  }

  calcDimensions() {
    // Calculate dimensions of text field
    // and adjust rectangle accordingly
    const padding = 10;
    const {textRef} = this.refs;
    const bbox = textRef.getBBox();
    this.setState({
      dimensions: {
        w: bbox.width + 2 * padding,
        h: 30,
      },
    });
  }

  render() {
    const {id, name, x, y} = this.props;
    const {dimensions} = this.state;
    const transformer = `translate(${x},${y})`;
    return (
      <g id={id} className="variable" transform={transformer}>
        <rect
          className="rect"
          rx="10" ry="10"
          width={dimensions.w} height={dimensions.h}
        />
        <text className="text" ref="textRef" x="10" y="20">{name}</text>
      </g>
    );
  }
}

Variable.propTypes = {
  model: React.PropTypes.object.isRequired,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
};

export default clickDrag(Variable, {touch: true});
