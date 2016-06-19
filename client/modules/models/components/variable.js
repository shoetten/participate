import React from 'react';
import clickDrag from 'react-clickdrag';

class Variable extends React.Component {
  constructor(props) {
    super(props);

    this.strokeWidth = 7;     // in px
    this.state = {
      dimensions: {x: -50, y: -15, w: 100, h: 30},
      hoverOuter: false,
      hoverInner: false,
    };

    this.props.selected = this.props.selected || false;
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
        x: - (bbox.width / 2 + padding),
        y: -15,
        w: bbox.width + 2 * padding,
        h: 30,
      },
    });
  }

  render() {
    const {id, name, x, y, selected} = this.props;
    const {dimensions, hoverOuter, hoverInner} = this.state;
    const transformer = `translate(${x},${y})`;
    const rectTransformer = `translate(${dimensions.x},${dimensions.y})`;
    return (
      <g id={id} className={`variable${selected ? ' selected' : ''}`} transform={transformer}>
        <g transform={rectTransformer}>
          <rect
            className={`outline${hoverOuter ? ' hover' : ''}`}
            rx="10" ry="10"
            x={-this.strokeWidth / 2} y={-this.strokeWidth / 2}
            width={dimensions.w + this.strokeWidth} height={dimensions.h + this.strokeWidth}
            onClick={() => console.log(`Clicked on border of variable ${id}`)}
            onMouseEnter={() => this.setState({hoverOuter: true})}
            onMouseLeave={() => this.setState({hoverOuter: false})}
          />
          <rect
            className={`rect${hoverInner ? ' hover' : ''}`}
            rx="10" ry="10"
            width={dimensions.w} height={dimensions.h}
            onClick={() => console.log(`Clicked variable ${id}`)}
            onMouseEnter={() => this.setState({hoverInner: true})}
            onMouseLeave={() => this.setState({hoverInner: false})}
          />
        </g>
        <text className="text" ref="textRef" x="0" y="0">{name}</text>
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
  selected: React.PropTypes.bool,
};

export default clickDrag(Variable, {touch: true});
