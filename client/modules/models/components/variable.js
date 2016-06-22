import React from 'react';

class Variable extends React.Component {
  constructor(props) {
    super(props);
    this.dragStart = this.dragStart.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);

    this.strokeWidth = 7;     // in px
    this.state = {
      x: props.x,
      y: props.y,
      dimensions: {x: -50, y: -15, w: 100, h: 30},
      hoverOuter: false,
      hoverInner: false,
      dragging: false,
      mouseDownPositionX: 0,
      mouseDownPositionY: 0,
      deltaX: 0,
      deltaY: 0,
    };

    this.props.selected = this.props.selected || false;
  }

  componentDidMount() {
    this.calcDimensions();

    // XXX: This should be attached via react, but is currently
    // not possible, due to a conflict between d3 zoom and react's
    // event system
    this.refs.innerRectRef.addEventListener('mousedown', this.dragStart);
    this.refs.innerRectRef.addEventListener('touchstart', this.dragStart);
  }

  componentWillReceiveProps(nextProps) {
    const {x, y} = this.props;
    if (x !== nextProps.x || y !== nextProps.y) {
      // console.log(`old pos: ${x}, ${y} | new pos: ${nextProps.x}, ${nextProps.y}`);
      const newState = {
        deltaX: 0,
        deltaY: 0,
      };
      if (!this.state.dragging) {
        // console.log('Update state with new position..');
        Object.assign(newState, {
          x: nextProps.x,
          y: nextProps.y,
        });
      }
      this.setState(newState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.name !== this.props.name) {
      this.calcDimensions();
    }
    if (this.state.dragging && !prevState.dragging) {
      // attach mouse event listeners to window instead of dom element,
      // so we can continue dragging, even if we loose focus, e.g.
      // when hitting another element layered on top
      document.addEventListener('mousemove', this.dragMove);
      document.addEventListener('mouseup', this.dragEnd);
      this.refs.innerRectRef.addEventListener('touchmove', this.dragMove);
      this.refs.innerRectRef.addEventListener('touchend', this.dragEnd);
    } else if (!this.state.dragging && prevState.dragging) {
      document.removeEventListener('mousemove', this.dragMove);
      document.removeEventListener('mouseup', this.dragEnd);
      this.refs.innerRectRef.removeEventListener('touchmove', this.dragMove);
      this.refs.innerRectRef.removeEventListener('touchend', this.dragEnd);
    }
  }

  componentWillUnmount() {
    this.refs.innerRectRef.removeEventListener('mousedown', this.dragStart);
    this.refs.innerRectRef.removeEventListener('touchstart', this.dragStart);
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

  dragStart(event) {
    // only left mouse button or touch input
    if (event.button === 0 || event.type === 'touchstart') {
      event.preventDefault();     // prevent things like text selection
      event.stopPropagation();    // stop propagation to zoom behaviour

      const pt = (event.changedTouches && event.changedTouches[0]) || event;
      this.setState({
        dragging: true,
        // used to determine relative mouse position
        mouseDownPositionX: pt.clientX,
        mouseDownPositionY: pt.clientY,
      });

      // const {deltaX, deltaY} = this.state;
      // if (deltaX !== 0 || deltaY !== 0) {
      //   console.log("drag started before old drag was saved");
      // } else {
      //   console.log("drag started");
      // }
    }
  }

  dragMove(event) {
    if (this.state.dragging) {
      event.stopPropagation();
      const {mouseDownPositionX, mouseDownPositionY, deltaX, deltaY} = this.state;

      const x = this.props.x + deltaX;
      const y = this.props.y + deltaY;
      const pt = (event.changedTouches && event.changedTouches[0]) || event;
      this.setState({
        x: x + pt.clientX - mouseDownPositionX,
        y: y + pt.clientY - mouseDownPositionY,
      });
    }
  }

  dragEnd(event) {
    event.stopPropagation();
    // XXX: Eventually clients should be updated more frequently,
    // through something like rocketchat:streamer, but for now
    // we only update once, when the dragging is finished
    const {x, y} = this.state;
    const {changePosition, id, modelId} = this.props;
    // only execute if variable was moved by more than a pixel
    const currentDeltaX = x - this.props.x;
    const currentDeltaY = y - this.props.y;
    if ((currentDeltaX >= 1 || currentDeltaY >= 1) ||
        (currentDeltaX <= -1 || currentDeltaY <= -1)) {
      this.setState({
        deltaX: currentDeltaX,
        deltaY: currentDeltaY,
      });
      // console.log(`Changing position to ${x}, ${y}..`);
      changePosition(id, x, y, modelId);
    }
    this.setState({dragging: false});
  }

  render() {
    const {
      id, name,
      selected, selectionCallback,
    } = this.props;
    const {
      dimensions,
      hoverOuter, hoverInner,
      x, y,
      dragging,
      // deltaX, deltaY,
    } = this.state;
    const transformer = `translate(${x},${y})`;
    const rectTransformer = `translate(${dimensions.x},${dimensions.y})`;
    const classes = `variable${selected ? ' selected' : ''}${dragging ? ' dragging' : ''}`;

    // if (this.state.dragging) {
    //   console.info(`x: ${x}, y: ${y} | deltaX: ${deltaX}, deltaY: ${deltaY}`);
    // } else {
    //   console.log(`x: ${x}, y: ${y} | deltaX: ${deltaX}, deltaY: ${deltaY}`);
    //   console.log(`${this.props.x} + ${deltaX} should equal ${x}: ${this.props.x + deltaX === x}`);
    //   console.log(`${this.props.y} + ${deltaY} should equal ${y}: ${this.props.y + deltaY === y}`);
    // }

    return (
      <g id={id} className={classes} transform={transformer}>
        <g transform={rectTransformer}>
          <rect
            className={`outline${hoverOuter ? ' hover' : ''}`}
            rx="10" ry="10"
            x={-this.strokeWidth / 2} y={-this.strokeWidth / 2}
            width={dimensions.w + this.strokeWidth} height={dimensions.h + this.strokeWidth}
            onMouseEnter={() => this.setState({hoverOuter: true})}
            onMouseLeave={() => this.setState({hoverOuter: false})}
          />
          <rect
            ref="innerRectRef"
            className={`rect${hoverInner ? ' hover' : ''}`}
            rx="10" ry="10"
            width={dimensions.w} height={dimensions.h}
            // onMouseDown={this.dragStart}
            // onTouchStart={this.dragStart}
            onClick={(event) => selectionCallback(event, id)}
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
  // data
  modelId: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  selected: React.PropTypes.bool,
  // actions
  changePosition: React.PropTypes.func.isRequired,
  // callbacks
  selectionCallback: React.PropTypes.func,
};

export default Variable;
