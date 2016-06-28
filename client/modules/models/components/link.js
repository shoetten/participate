import React from 'react';
import {isEqual, clone} from 'lodash/fp';

class Link extends React.Component {
  constructor(props) {
    super(props);
    this.dragStart = this.dragStart.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);

    this.state = {
      controlPointPos: props.controlPointPos,
      mouseDownPositionX: 0,
      mouseDownPositionY: 0,
      deltaX: 0,
      deltaY: 0,
      path: this.updatePath(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    const {fromVar, toVar, controlPointPos: control} = this.props;
    const {fromVar: newFromVar, toVar: newToVar, controlPointPos: newControl} = nextProps;

    if (!isEqual(fromVar.position, newFromVar.position) ||
        !isEqual(toVar.position, newToVar.position)) {
      this.setState({path: this.updatePath(nextProps)});
    }

    // check if there is an updated position and update state accordingly
    if (!isEqual(control, newControl)) {
      const newState = {
        deltaX: 0,
        deltaY: 0,
      };
      if (!this.state.dragging) {
        Object.assign(newState, {controlPointPos: newControl});
      }
      this.setState(newState, () => this.setState({path: this.updatePath()}));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dragging && !prevState.dragging) {
      // attach mouse event listeners to window instead of dom element,
      // so we can continue dragging, even if we loose focus, e.g.
      // when hitting another element layered on top
      document.addEventListener('mousemove', this.dragMove);
      document.addEventListener('mouseup', this.dragEnd);
      this.refs.controlRef.addEventListener('touchmove', this.dragMove);
      this.refs.controlRef.addEventListener('touchend', this.dragEnd);
    } else if (!this.state.dragging && prevState.dragging) {
      document.removeEventListener('mousemove', this.dragMove);
      document.removeEventListener('mouseup', this.dragEnd);
      this.refs.controlRef.removeEventListener('touchmove', this.dragMove);
      this.refs.controlRef.removeEventListener('touchend', this.dragEnd);
    }
  }

  onRemoveClick(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const {remove, id, modelId, selectionCallback} = this.props;
    remove(id, modelId);
    selectionCallback(false);   // deselect link
  }

  updatePath(props = this.props) {
    const {fromVar, toVar} = props;
    const control = this.state ? this.state.controlPointPos : props.controlPointPos;

    const {center, radius} = this.calculateArcCenterRadius(fromVar, toVar, control);

    // Calculate arc sweep & large flags
    let largeFlag;
    let sweepFlag;
    if (radius !== 0) {
      const fromPos = fromVar.position;
      const toPos = toVar.position;

      // On which side of the (imaginary) straigt line between the
      // variables is the control point? To check this, we
      // 1. Define the vector between the variables (so between a & c)
      // 2. Define the vector between fromVar and control point (so a & b)
      // 3. Calculate the cross product to determine which side you're on.
      sweepFlag = (toPos.x - fromPos.x) * (control.y - fromPos.y) > (toPos.y - fromPos.y) * (control.x - fromPos.x) ? '0' : '1';

      // const startAngle = Math.atan2(fromPos.y - center.y, fromPos.x - center.x);
      // const endAngle = Math.atan2(toPos.y - center.y, toPos.x - center.x);
      // largeFlag = endAngle - startAngle <= Math.PI ? '0' : '1';
      largeFlag = '0';
      // console.log(`startAngle: ${startAngle * (180/Math.PI)}, endAngle: ${endAngle * (180/Math.PI)}`);
      // console.log(`endAngle - startAngle: ${(endAngle - startAngle) * (180/Math.PI)}`);
      // console.log(`largeFlag: ${largeFlag}, sweepFlag: ${sweepFlag}`);

      // console.log(`cx="${center.x}" cy="${center.y}"`);
    } else {
      // If the radius is zero, the flags have no meaning
      largeFlag = '0';
      sweepFlag = '0';
    }

    // XXX: set start and end points to central points for now
    const start = fromVar.position;
    const end = toVar.position;

    return `M ${start.x},${start.y} A ${radius},${radius} 0 ${largeFlag},${sweepFlag} ${end.x},${end.y}`;
  }

  // Calculates the center and radius of the circle
  // defined by the three given points.
  // For an explanation of the algorithm used, see
  // http://stackoverflow.com/a/32865629/4500049
  calculateArcCenterRadius(fromVar, toVar, control) {
    const a = clone(fromVar.position);
    const b = clone(control);
    const c = clone(toVar.position);

    // treat point A as coordinate origin, translate the rest
    b.x -= a.x;
    b.y -= a.y;
    c.x -= a.x;
    c.y -= a.y;

    const z1 = b.x * b.x + b.y * b.y;
    const z2 = c.x * c.x + c.y * c.y;
    const d = 2 * (b.x * c.y - c.x * b.y);

    // d is close to 0, when the three points are aligned.
    // In that case, the following formula fails, so we just
    // render a straight line.
    let center;
    let radius;
    // console.log(`z1: ${z1}, z2: ${z2}, d: ${d}`);
    if (d < 0.1 && d > -0.1) {
      // Put the center in the middle between the
      // variables and set the radius to zero.
      center = {
        x: (fromVar.position.x + toVar.position.x) / 2,
        y: (fromVar.position.y + toVar.position.y) / 2,
      };
      radius = 0;
    } else {
      center = {
        x: (z1 * c.y - z2 * b.y) / d + a.x,
        y: (b.x * z2 - c.x * z1) / d + a.y,
      };
      // Since we're just dealing with circular arc's,
      // we can just calculate the distance between the
      // center and one of the variables
      radius = Math.sqrt(Math.pow(center.x - a.x, 2) + Math.pow(center.y - a.y, 2));
    }

    return {center, radius};
  }

  calculateBorderPoint(var1, var2) {

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
    }
  }

  dragMove(event) {
    if (this.state.dragging) {
      event.stopPropagation();
      const {scale} = this.props;
      const {mouseDownPositionX, mouseDownPositionY, deltaX, deltaY} = this.state;

      // Add the old delta to the original position,
      // in case the drag before was not saved, yet.
      const x = this.props.controlPointPos.x + deltaX;
      const y = this.props.controlPointPos.y + deltaY;
      const pt = (event.changedTouches && event.changedTouches[0]) || event;
      this.setState({controlPointPos: {
        x: x + (pt.clientX - mouseDownPositionX) / scale,
        y: y + (pt.clientY - mouseDownPositionY) / scale,
      }}, () => this.setState({path: this.updatePath()}));
    }
  }

  dragEnd(event) {
    event.stopPropagation();
    event.preventDefault();
    // XXX: Eventually clients should be updated more frequently,
    // through something like rocketchat:streamer, but for now
    // we only update once, when the dragging is finished

    const {controlPointPos: control} = this.state;
    const {changeControlPosition, id, modelId} = this.props;

    // only execute if variable was moved by more than a pixel
    const currentDeltaX = control.x - this.props.controlPointPos.x;
    const currentDeltaY = control.y - this.props.controlPointPos.y;
    if ((currentDeltaX >= 1 || currentDeltaY >= 1) ||
        (currentDeltaX <= -1 || currentDeltaY <= -1)) {
      this.setState({
        deltaX: currentDeltaX,
        deltaY: currentDeltaY,
      });
      // console.log(`Changing position to ${x}, ${y}..`);
      changeControlPosition(id, control, modelId);
    }
    this.setState({dragging: false});
  }

  render() {
    const {selected, selectionCallback, id} = this.props;
    const {path, dragging, controlPointPos: control} = this.state;

    const classes = `link${selected ? ' selected' : ''}${dragging ? ' dragging' : ''}`;

    return (
      <g className={classes}>
        <path
          d={path}
          onClick={() => selectionCallback(id)}
        />
        <circle
          cx={control.x} cy={control.y}
          r="10"
          className="control-point"
          ref="controlRef"
          onMouseDown={this.dragStart}
          onTouchStart={this.dragStart}
        />
      </g>
    );
  }
}

Link.propTypes = {
  // data
  modelId: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  fromVar: React.PropTypes.object.isRequired,
  toVar: React.PropTypes.object.isRequired,
  controlPointPos: React.PropTypes.object.isRequired,
  scale: React.PropTypes.number.isRequired,
  selected: React.PropTypes.bool,
  // callbacks
  selectionCallback: React.PropTypes.func,
  // actions
  changeControlPosition: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
};

Link.defaultProps = {
  selected: false,
};

export default Link;
