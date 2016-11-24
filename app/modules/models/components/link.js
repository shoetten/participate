import React from 'react';
import autobind from 'autobind-decorator';
import {isEqual, clone, sortBy} from 'lodash/fp';
import {varStrokeWidth} from '../configs/constants';

@autobind
class Link extends React.PureComponent {
  constructor(props) {
    super(props);

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
        !isEqual(toVar.position, newToVar.position) ||
        !isEqual(fromVar.dimensions, newFromVar.dimensions) ||
        !isEqual(toVar.dimensions, newToVar.dimensions)) {
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
      this.controlRef.addEventListener('touchmove', this.dragMove);
      this.controlRef.addEventListener('touchend', this.dragEnd);
    } else if (!this.state.dragging && prevState.dragging) {
      document.removeEventListener('mousemove', this.dragMove);
      document.removeEventListener('mouseup', this.dragEnd);
      this.controlRef.removeEventListener('touchmove', this.dragMove);
      this.controlRef.removeEventListener('touchend', this.dragEnd);
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

    this.start = this.calculateBorderPoint(fromVar, center, control, 4);
    this.end = this.calculateBorderPoint(toVar, center, control, 7);

    // Calculate arc sweep & large flags
    if (radius !== 0) {
      // On which side of the (imaginary) straigt line between the
      // variables is the control point? To check this, we
      // 1. Define the vector between the variables (so between a & c)
      // 2. Define the vector between fromVar and control point (so a & b)
      // 3. Calculate the cross product to determine which side you're on.
      this.sweepFlag =
        (this.end.x - this.start.x) * (control.y - this.start.y)
        > (this.end.y - this.start.y) * (control.x - this.start.x)
        ? '0' : '1';

      // Is the angle centred around the control point acute (< 90°)
      // or obtuse (> 90°)? If the angle is acute, we need to draw
      // the large arc.
      const startAngle = Math.atan2(this.start.y - control.y, this.start.x - control.x);
      const endAngle = Math.atan2(this.end.y - control.y, this.end.x - control.x);
      const angle = ((endAngle - startAngle + (3 * Math.PI)) % (2 * Math.PI)) - Math.PI;

      this.largeFlag = Math.abs(angle) > Math.PI / 2 ? '0' : '1';

      // console.log(`startAngle = Math.atan2(${this.start.y} - ${control.y}, ${this.start.x} - ${control.x})`);
      // console.log(`startAngle: ${startAngle * (180/Math.PI)}, endAngle: ${endAngle * (180/Math.PI)}`);
      // console.log(`endAngle - startAngle: ${(angle) * (180/Math.PI)}`);
      // console.log(`largeFlag: ${this.largeFlag}, sweepFlag: ${this.sweepFlag}`);

      // console.log(`cx="${center.x}" cy="${center.y}"`);
    } else {
      // If the radius is zero, the flags have no meaning
      this.largeFlag = '0';
      this.sweepFlag = '0';
    }

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

    const z1 = (b.x * b.x) + (b.y * b.y);
    const z2 = (c.x * c.x) + (c.y * c.y);
    const d = 2 * ((b.x * c.y) - (c.x * b.y));
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
        x: (((z1 * c.y) - (z2 * b.y)) / d) + a.x,
        y: (((b.x * z2) - (c.x * z1)) / d) + a.y,
      };
      // Since we're just dealing with circular arc's,
      // we can just calculate the distance between the
      // center and one of the variables
      radius = Math.sqrt(((center.x - a.x) ** 2) + ((center.y - a.y) ** 2));
    }

    return {center, radius};
  }

  /**
   * Calculate the intersection of the border of the given variable rectangle
   * and the circular arc drawn by this link.
   * For a better understanding of what is going on here, see:
   * http://stackoverflow.com/questions/38029109/draw-non-overlapping-arc-between-two-rectangles
   * @param  {Object} variable     Variable that defines the rectangle border
   * @param  {Object} circleCenter Center point of the circle that defines the arc
   * @param  {Object} controlPoint Position of the control point
   * @param  {Number} padding      Space between the rectangle and the link
   * @return {Object}              Object containing the intersection point.
   */
  calculateBorderPoint(variable, circleCenter, controlPoint, padding) {
    const a = clone(variable.position);
    const control = clone(controlPoint);

    // Treat center of circle as coordinate origin.
    a.x -= circleCenter.x;
    a.y -= circleCenter.y;
    control.x -= circleCenter.x;
    control.y -= circleCenter.y;

    let points = [];

    // Check east & west with possible x values
    const possibleX = [
      a.x - (variable.dimensions.width / 2) - varStrokeWidth - padding,
      a.x + (variable.dimensions.width / 2) + varStrokeWidth + padding,
    ];
    possibleX.forEach((x) => {
      const ySquared = [
        Math.sqrt((this.radius ** 2) - (x ** 2)),
        -Math.sqrt((this.radius ** 2) - (x ** 2)),
      ];
      // Check if the derived y value is in range of rectangle
      ySquared.forEach((y) => {
        if (y >= a.y - (variable.dimensions.height / 2) - varStrokeWidth - padding &&
            y <= a.y + (variable.dimensions.height / 2) + varStrokeWidth + padding) {
          points.push({x, y});
        }
      });
    });

    // Check north & south with possible y values
    const possibleY = [
      a.y - (variable.dimensions.height / 2) - varStrokeWidth - padding,
      a.y + (variable.dimensions.height / 2) + varStrokeWidth + padding,
    ];
    possibleY.forEach((y) => {
      const xSquared = [
        Math.sqrt((this.radius ** 2) - (y ** 2)),
        -Math.sqrt((this.radius ** 2) - (y ** 2)),
      ];
      // Check if the derived x value is in range of rectangle
      xSquared.forEach((x) => {
        if (x >= a.x - (variable.dimensions.width / 2) - varStrokeWidth - padding &&
            x <= a.x + (variable.dimensions.width / 2) + varStrokeWidth + padding) {
          points.push({x, y});
        }
      });
    });

    // Get the point closest to the control point.
    points = sortBy((point => (
      Math.sqrt(((control.x - point.x) ** 2) + ((control.y - point.y) ** 2))
    )), points);

    // Fallback if no point was found
    // XXX: Remove this.
    if (points.length === 0) {
      points.push({x: a.x, y: a.y});
    }

    // Translate it back.
    points[0].x += circleCenter.x;
    points[0].y += circleCenter.y;

    return points[0];
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
        angle,
      );
    } else {
      const vector = [
        this.end.x - this.start.x,
        this.end.y - this.start.y,
      ];
      const length = Math.sqrt((vector[0] ** 2) + (vector[1] ** 2));
      // Calculate the unit vector and multiply by desired distance from end point.
      const translationVector = [
        (vector[0] / length) * distance,
        (vector[1] / length) * distance,
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
        x: x + ((pt.clientX - mouseDownPositionX) / scale),
        y: y + ((pt.clientY - mouseDownPositionY) / scale),
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

    // console.log(`Render link ${this.props.id}`);

    return (
      <g className={classes} ref={c => (this.node = c)}>
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
          ref={c => (this.controlRef = c)}
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
