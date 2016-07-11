import React from 'react';
import {isEqual, clone} from 'lodash/fp';

class Link extends React.Component {
  constructor(props) {
    super(props);
    this.dragStart = this.dragStart.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onPolarityEdit = this.onPolarityEdit.bind(this);
    this.onChangePolarity = this.onChangePolarity.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);

    const controlPointPos = props.controlPointPos;
    const path = this.calculatePath(props, controlPointPos);
    const polarityPointPos = this.calculatePolarityPoint(props, controlPointPos);
    this.state = {
      path,
      controlPointPos,
      polarityPointPos,
      mouseDownPositionX: 0,
      mouseDownPositionY: 0,
      deltaX: 0,
      deltaY: 0,
      editing: false,
    };
  }

  componentWillMount() {
    const {selected} = this.props;
    if (selected) {
      this.setState({editing: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    const {fromVar, toVar, controlPointPos: control} = this.props;
    const {fromVar: newFromVar, toVar: newToVar, controlPointPos: newControl} = nextProps;

    if (!isEqual(fromVar.position, newFromVar.position) ||
        !isEqual(toVar.position, newToVar.position)) {
      const path = this.calculatePath(nextProps);
      const polarityPointPos = this.calculatePolarityPoint(nextProps);
      this.setState({path, polarityPointPos});
    }

    // Check if there is an updated position and update state accordingly.
    if (!isEqual(control, newControl)) {
      const newState = {
        deltaX: 0,
        deltaY: 0,
      };
      if (!this.state.dragging) {
        const path = this.calculatePath(nextProps, newControl);
        const polarityPointPos = this.calculatePolarityPoint(nextProps);
        Object.assign(newState, {
          path,
          controlPointPos: newControl,
          polarityPointPos,
        });
      }
      this.setState(newState);
    }

    if (this.props.selected && !nextProps.selected) {
      this.setState({editing: false});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dragging && !prevState.dragging) {
      // Attach mouse event listeners to window instead of dom element,
      // so we can continue dragging, even if we loose focus, e.g.
      // when hitting another element layered on top.
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

  onClick() {
    const {id, select, selected} = this.props;
    if (!selected) {
      // Show this link on top
      this.node.parentElement.appendChild(this.node);
      select(id);
    }
  }

  onPolarityEdit(event) {
    if (event && event.preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.onClick();
    this.setState({editing: true});
  }

  onChangePolarity(polarity) {
    const {changePolarity, id, modelId} = this.props;
    changePolarity(id, polarity, modelId);

    this.setState({editing: false});
  }

  onRemoveClick(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const {remove, select, id, modelId} = this.props;
    remove(id, modelId);
    select('');   // deselect link
  }

  calculatePath(props = this.props, control = this.state.controlPointPos) {
    const {fromVar, toVar} = props;

    const {center, radius} = this.calculateArcCenterRadius(fromVar, toVar, control);
    this.center = center;
    this.radius = radius;

    // Calculate arc sweep & large flags
    if (radius !== 0) {
      const fromPos = fromVar.position;
      const toPos = toVar.position;

      // On which side of the (imaginary) straigt line between the
      // variables is the control point? To check this, we
      // 1. Define the vector between the variables (so between a & c)
      // 2. Define the vector between fromVar and control point (so a & b)
      // 3. Calculate the cross product to determine which side you're on.
      this.sweepFlag = (toPos.x - fromPos.x) * (control.y - fromPos.y) > (toPos.y - fromPos.y) * (control.x - fromPos.x) ? '0' : '1';

      // const startAngle = Math.atan2(fromPos.y - center.y, fromPos.x - center.x);
      // const endAngle = Math.atan2(toPos.y - center.y, toPos.x - center.x);
      // largeFlag = endAngle - startAngle <= Math.PI ? '0' : '1';
      this.largeFlag = '0';
      // console.log(`startAngle: ${startAngle * (180/Math.PI)}, endAngle: ${endAngle * (180/Math.PI)}`);
      // console.log(`endAngle - startAngle: ${(endAngle - startAngle) * (180/Math.PI)}`);
      // console.log(`largeFlag: ${largeFlag}, sweepFlag: ${sweepFlag}`);

      // console.log(`cx="${center.x}" cy="${center.y}"`);
    } else {
      // If the radius is zero, the flags have no meaning
      this.largeFlag = '0';
      this.sweepFlag = '0';
    }

    // XXX: set start and end points to central points for now
    this.start = fromVar.position;
    this.end = toVar.position;

    return `M ${this.start.x},${this.start.y} A ${this.radius},${this.radius} 0 ${this.largeFlag},${this.sweepFlag} ${this.end.x},${this.end.y}`;
  }

  // Calculates the center and radius of the circle
  // defined by the three given points.
  // For an explanation of the algorithm used, see
  // http://stackoverflow.com/a/32865629/4500049
  calculateArcCenterRadius(fromVar, toVar, controlPoint) {
    const a = clone(fromVar.position);
    const b = clone(controlPoint);
    const c = clone(toVar.position);

    // Treat point A as coordinate origin, translate the rest.
    b.x -= a.x;
    b.y -= a.y;
    c.x -= a.x;
    c.y -= a.y;

    const z1 = b.x * b.x + b.y * b.y;
    const z2 = c.x * c.x + c.y * c.y;
    const d = 2 * (b.x * c.y - c.x * b.y);
    // console.log(`z1: ${z1}, z2: ${z2}, d: ${d}`);

    let center;
    let radius;
    // When d is close to zero, the three points are aligned.
    // In that case, the following formula fails, so we just
    // render a straight line.
    if (d < 0.5 && d > -0.5) {
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

  calculatePolarityPoint() {
    const distance = 65;
    let point;
    // If the radius is not zero, we have a circular arc.
    // Otherwise it's just a straight line.
    if (this.radius !== 0) {
      let angle = distance / this.radius;
      angle = this.sweepFlag === '1' ? angle : -angle;

      point = this.rotate(
        this.center.x, this.center.y,
        this.end.x, this.end.y,
        angle
      );
    } else {
      const vector = [
        this.end.x - this.start.x,
        this.end.y - this.start.y,
      ];
      const length = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
      // Calculate the unit vector and multiply by desired distance from end point.
      const translationVector = [
        vector[0] / length * distance,
        vector[1] / length * distance,
      ];
      point = {
        x: Math.round(this.end.x - translationVector[0]),
        y: Math.round(this.end.y - translationVector[1]),
      };
    }

    return point;
  }

  /**
   * Rotate a point around a circle center
   * @param  {Number} cx    x-coordinate of circle center
   * @param  {Number} cy    y-coordinate of circle center
   * @param  {Number} x     x-coordinate of point to be rotated
   * @param  {Number} y     y-coordinate of point to be rotated
   * @param  {Number} angle Angle in degrees
   * @return {Object}       Object holding the freshly rotated coordinates
   */
  rotate(cx, cy, x, y, angle) {
    // const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: Math.round((cos * (x - cx)) + (sin * (y - cy)) + cx),
      y: Math.round((cos * (y - cy)) - (sin * (x - cx)) + cy),
    };
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
      const controlPointPos = {
        x: x + (pt.clientX - mouseDownPositionX) / scale,
        y: y + (pt.clientY - mouseDownPositionY) / scale,
      };
      const path = this.calculatePath(undefined, controlPointPos);
      const polarityPointPos = this.calculatePolarityPoint();
      this.setState({
        path,
        controlPointPos,
        polarityPointPos,
      });
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
    const {selected, polarity} = this.props;
    const {
      path,
      controlPointPos: control,
      polarityPointPos: polarityPos,
      dragging,
      editing,
    } = this.state;

    const classes = `link${selected ? ' selected' : ''}${dragging ? ' dragging' : ''}`;

    return (
      <g className={classes} ref={(c) => (this.node = c)}>
        <path
          d={path}
          style={{markerEnd: 'url("#end-arrow")'}}
          onClick={this.onClick}
        />

        <g
          className={`polarity${editing ? ' editing' : ''}`}
          transform={`translate(${polarityPos.x},${polarityPos.y})`}
        >
          <rect
            rx="5" ry="5"
            x={-(30 / 2)} y={-(25 / 2)}
            width={30} height={25}
            className={polarity < 0 ? 'negative' : 'positive'}
            onClick={this.onPolarityEdit}
          />
          <text x="0" y="0">{polarity < 0 ? '-' : '+'}</text>

          <g className="edit-polarity" transform="translate(40, 0)">
            <g transform="translate(0, -13)">
              <rect
                rx="5" ry="5"
                x={-(30 / 2)} y={-(25 / 2)}
                width={30} height={25}
                className="negative"
                onClick={() => this.onChangePolarity(-1)}
              />
              <text x="0" y="0">-</text>
            </g>
            <g transform="translate(0, 13)">
              <rect
                rx="5" ry="5"
                x={-(30 / 2)} y={-(25 / 2)}
                width={30} height={25}
                className="positive"
                onClick={() => this.onChangePolarity(1)}
              />
              <text x="0" y="0">+</text>
            </g>
          </g>
        </g>
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
  polarity: React.PropTypes.number.isRequired,
  scale: React.PropTypes.number.isRequired,
  selected: React.PropTypes.bool,
  // actions
  changeControlPosition: React.PropTypes.func.isRequired,
  changePolarity: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
  select: React.PropTypes.func.isRequired,
};

Link.defaultProps = {
  selected: false,
};

export default Link;
