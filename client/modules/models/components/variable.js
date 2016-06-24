import React from 'react';

class Variable extends React.Component {
  constructor(props) {
    super(props);
    this.dragStart = this.dragStart.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);

    this.strokeWidth = 7;     // in px
    this.state = {
      x: props.position.x,
      y: props.position.y,
      hoverOuter: false,
      hoverInner: false,
      hoverEdit: false,
      dragging: false,
      mouseDownPositionX: 0,
      mouseDownPositionY: 0,
      deltaX: 0,
      deltaY: 0,
    };

    this.props.selected = this.props.selected || false;
    this.props.editing = this.props.editing || false;
  }

  componentDidMount() {
    // XXX: This should be attached via react, but is currently
    // not possible, due to a conflict between d3 zoom and react's
    // event system
    this.refs.innerRectRef.addEventListener('mousedown', this.dragStart);
    this.refs.innerRectRef.addEventListener('touchstart', this.dragStart);
  }

  componentWillReceiveProps(nextProps) {
    const {x, y} = this.props.position;
    const {x: newX, y: newY} = nextProps.position;
    if (x !== newX || y !== newY) {
      const newState = {
        deltaX: 0,
        deltaY: 0,
      };
      if (!this.state.dragging) {
        // console.log('Update state with new position..');
        Object.assign(newState, {
          x: newX,
          y: newY,
        });
      }
      this.setState(newState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.name !== this.props.name) {
      // It's not ideal, to call this here, because it
      // causes react to render twice on every name change.
      // But since we need the actual size of the text dom
      // element, this is the only way, without simulating.
      this.updateDimensions();
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

  onRemoveClick(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const {remove, id, modelId, selectionCallback} = this.props;
    remove(id, modelId);
    selectionCallback(false);   // deselect variable
  }

  /**
   * Calculate dimensions of text field, save them
   * and adjust the rectangle accordingly.
   */
  updateDimensions() {
    const padding = 10;
    const {textRef} = this.refs;
    const bbox = textRef.getBBox();
    const dimensions = {
      width: Math.max(bbox.width, 10) + 2 * padding,
      height: 30,  // height is fixed for now
    };

    const {changeDimensions, id, modelId} = this.props;
    changeDimensions(id, dimensions, modelId);
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
      const {scale, position} = this.props;
      const {mouseDownPositionX, mouseDownPositionY, deltaX, deltaY} = this.state;

      // Add the old delta to the original position,
      // in case the drag before was not saved, yet.
      const x = position.x + deltaX;
      const y = position.y + deltaY;
      const pt = (event.changedTouches && event.changedTouches[0]) || event;
      this.setState({
        x: x + (pt.clientX - mouseDownPositionX) / scale,
        y: y + (pt.clientY - mouseDownPositionY) / scale,
      });
    }
  }

  dragEnd(event) {
    event.stopPropagation();
    event.preventDefault();
    // XXX: Eventually clients should be updated more frequently,
    // through something like rocketchat:streamer, but for now
    // we only update once, when the dragging is finished

    const {x, y} = this.state;
    const {changePosition, id, modelId, position} = this.props;

    // only execute if variable was moved by more than a pixel
    const currentDeltaX = x - position.x;
    const currentDeltaY = y - position.y;
    if ((currentDeltaX >= 1 || currentDeltaY >= 1) ||
        (currentDeltaX <= -1 || currentDeltaY <= -1)) {
      this.setState({
        deltaX: currentDeltaX,
        deltaY: currentDeltaY,
      });
      // console.log(`Changing position to ${x}, ${y}..`);
      changePosition(id, x, y, modelId);
    } else {
      // if there is no delta, this is not a drag
      // at all, but a click!
      const {selected, selectionCallback, index} = this.props;
      if (!selected) {
        selectionCallback(index);
      }
    }
    this.setState({dragging: false});
  }

  render() {
    const {
      index,
      name,
      selected,
      editing, editCallback,
      dimensions,
    } = this.props;
    const {
      hoverOuter, hoverInner, hoverEdit,
      x, y,
      dragging,
    } = this.state;
    const stroke = this.strokeWidth;
    const classes = `variable${selected ? ' selected' : ''}${dragging ? ' dragging' : ''}`;

    return (
      <g className={classes} transform={`translate(${x},${y})`}>
        <g transform={`translate(${-dimensions.width / 2},${-dimensions.height / 2})`}>
          <rect
            className={`outline${hoverOuter ? ' hover' : ''}`}
            rx="10" ry="10"
            x={-stroke / 2} y={-stroke / 2}
            width={dimensions.width + stroke} height={dimensions.height + stroke}
            onMouseEnter={() => this.setState({hoverOuter: true})}
            onMouseLeave={() => this.setState({hoverOuter: false})}
          />
          <rect
            ref="innerRectRef"
            className={`rect${hoverInner ? ' hover' : ''}`}
            rx="7" ry="7"
            width={dimensions.width} height={dimensions.height}
            onMouseEnter={() => this.setState({hoverInner: true})}
            onMouseLeave={() => this.setState({hoverInner: false})}
          />
        </g>
        {!editing ?
          <text className="text" ref="textRef" x="0" y="0">{name}</text>
        : null}

        <g
          className={`edit${editing ? ' active' : ''}`}
          transform={`translate(${dimensions.width / 2 + stroke + 16},${-(dimensions.height / 2 + stroke) - 11})`}
        >
          <circle
            ref="editBtnRef"
            className={`${hoverEdit ? 'hover' : ''}`}
            cx="12" cy="12" r="18"
            onMouseEnter={() => this.setState({hoverEdit: true})}
            onMouseLeave={() => this.setState({hoverEdit: false})}
            onClick={(e) => editCallback(e, index)}
          />
          {/* Material pencil icon */}
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </g>
        <g
          className={`remove${editing ? ' active' : ''}`}
          transform={`translate(${dimensions.width / 2 + stroke + 16},${-(dimensions.height / 2 + stroke) + 31})`}
        >
          <circle
            cx="12" cy="12" r="18"
            onClick={this.onRemoveClick}
          />
          {/* Material clear icon */}
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </g>
      </g>
    );
  }
}

Variable.propTypes = {
  // data
  modelId: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  position: React.PropTypes.object.isRequired,
  dimensions: React.PropTypes.object.isRequired,
  scale: React.PropTypes.number.isRequired,
  selected: React.PropTypes.bool,
  editing: React.PropTypes.bool,
  index: React.PropTypes.number.isRequired,
  // actions
  changePosition: React.PropTypes.func.isRequired,
  changeDimensions: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
  // callbacks
  selectionCallback: React.PropTypes.func,
  editCallback: React.PropTypes.func,
};

export default Variable;
