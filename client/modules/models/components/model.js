import React from 'react';
import $ from 'jquery';
import Materialize from 'meteor/poetic:materialize-scss';
// weird export of Materialize
const Material = Materialize.Materialize;
// XXX: Once meteor supports es6 live bindings with objects,
// we can start using real imports again. Tracked here:
// https://github.com/benjamn/reify/issues/29
// import {
//   scaleLinear,
//   zoom, zoomIdentity,
//   select,
//   event as currentEvent,
// } from 'd3';
const d3 = require('d3');
import Variable from '../containers/variable';
import EnsureLoggedIn from '../../users/containers/ensure_logged_in';

class Model extends React.Component {
  constructor(props) {
    super(props);
    this.onCreateVariable = this.onCreateVariable.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.scaleTo = this.scaleTo.bind(this);
    this.onCanvasDown = this.onCanvasDown.bind(this);
    this.onVariableEdit = this.onVariableEdit.bind(this);
    this.changeVariableName = this.changeVariableName.bind(this);

    // these won't change
    this.scaleExtent = [0.5, 5];
    this.zoomScale = d3.scaleLinear()
      .domain([1, 100])   // 1 to 100 percent
      .range(this.scaleExtent);

    // set scales for semantic zooming
    const xScale = d3.scaleLinear()
      .domain([0, 1000])
      .range([0, 1000]);
    const yScale = d3.scaleLinear()
      .domain([0, 800])
      .range([0, 800]);

    this.state = {
      scale: 1,
      xScale,
      yScale,
      selected: false,
      editingVariable: false,
      editBoxPos: {},
      zoomTransform: d3.zoomIdentity.toString(),
      justAdded: '',
    };

    const {setPageTitle, model} = this.props;
    // if user is not authorized, there might be no model
    if (model) {
      setPageTitle(model.title);
    }
  }

  componentDidMount() {
    // init materialize tooltips
    $('.tooltipped').tooltip({delay: 20});

    const {xScale, yScale} = this.state;

    // init the pan & zoom behaviour
    this.zoom = d3.zoom()
      .scaleExtent(this.scaleExtent)
      .on('zoom', () => {
        this.setState({
          scale: d3.event.transform.k,
          xScale: d3.event.transform.rescaleX(xScale),
          yScale: d3.event.transform.rescaleY(yScale),
          zoomTransform: d3.event.transform.toString(),
        });
      });

    this.eventCatcher = d3.select('svg.canvas .event-catcher')
      // attach click handler here, because
      // everything else is consumed by d3
      .on('click', this.onCanvasDown);
    this.eventCatcher.call(this.zoom).on('dblclick.zoom', null);

    // XXX: dirty fix to get the zoom range slider thumb
    // hidden again in firefox. until this is resolved:
    // https://github.com/Dogfalo/materialize/issues/2183
    $('.range-field > input[type="range"]').on('mouseup', function () {
      const thumbElm = $(this).parent().find('.thumb.active');
      if ($(this).parent().find('.thumb.active').length) {
        setTimeout(() => {
          thumbElm.remove();
        }, 50);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      // display error for 5 seconds
      Material.toast(nextProps.error, 5000, 'toast-error');
    }

    // XXX: This is a bad way of checking if a new
    // variable was inserted..
    const index = nextProps.variables.length - 1;   // get last index
    if (this.state.justAdded === nextProps.variables[index]._id) {
      // XXX: This should be calculated dynamically.
      const dimensions = {
        h: 30,
        w: 112,
        x: -56,
        y: -15,
      };
      this.onVariableEdit(null, index, dimensions);
    }
  }

  onCanvasDown() {
    this.setState({selected: false});
  }

  onCreateVariable(event, offset) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const pt = (event.changedTouches && event.changedTouches[0]) || event;
    const {createVariable, model} = this.props;
    const {xScale, yScale} = this.state;

    createVariable(
      'New variable',
      xScale.invert(pt.clientX + offset.x),
      yScale.invert(pt.clientY + offset.y),
      model._id,
      // execute callback when method stub is done
      (id) => this.setState({justAdded: id})
    );
  }

  onVariableEdit(event, index, dimensions) {
    if (event && event.preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }

    const {xScale, yScale} = this.state;
    const x = this.props.variables[index].position.x;
    const y = this.props.variables[index].position.y;
    this.setState({
      editingVariable: true,
      selected: index,
      editBoxPos: {
        left: xScale(x + dimensions.x),
        top: yScale(y + dimensions.y),
        width: dimensions.w,
        height: dimensions.h,
      },
    }, () => this.refs.variableName.focus());
  }

  changeVariableName(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const {changeVariableName, model, variables} = this.props;
    const {selected} = this.state;
    const {variableName} = this.refs;
    changeVariableName(variables[selected]._id, variableName.value.trim(), model._id);

    this.setState({
      editingVariable: false,
      justAdded: '',
    });
  }

  resetZoom(smooth = true) {
    const selection = smooth ? this.eventCatcher.transition().duration(750) : this.eventCatcher;
    selection.call(this.zoom.transform, d3.zoomIdentity);
  }

  scaleTo(newScale, smooth = false) {
    const selection = smooth ? this.eventCatcher.transition().duration(500) : this.eventCatcher;
    selection.call(this.zoom.scaleTo, newScale);
  }

  render() {
    const {model, variables, links} = this.props;
    const {
      scale, zoomTransform,
      selected,
      editingVariable, editBoxPos,
      justAdded,
    } = this.state;

    return (
      <EnsureLoggedIn>
        <div className="single-model">
          <svg className="canvas" ref="canvasRef">
            <rect
              className="event-catcher"
              x="0" y="0"
              // just make it huge, so it will cover every screen
              width="8000" height="8000"
            />
            <g transform={zoomTransform}>
              {variables.map((variable, index) => (
                <Variable
                  modelId={model._id}
                  key={variable._id}
                  id={variable._id}
                  index={index}
                  name={variable.name}
                  x={variable.position.x}
                  y={variable.position.y}
                  scale={scale}
                  selected={selected === index}
                  editing={selected === index && editingVariable}
                  selectionCallback={selectedIndex => {
                    this.setState({selected: selectedIndex});
                  }}
                  editCallback={this.onVariableEdit}
                />
              ))}
            </g>
          </svg>

          {editingVariable !== false ?
            <form
              onSubmit={this.changeVariableName}
              className="edit-variable"
              style={{
                top: editBoxPos.top,
                left: editBoxPos.left,
                width: editBoxPos.width,
                height: editBoxPos.height,
                transform: `scale(${scale})`,
              }}
            >
              <input
                type="text"
                ref="variableName"
                defaultValue={justAdded ? '' : variables[selected].name}
                placeholder="Variable name.."
                onBlur={this.changeVariableName}
              />
            </form>
          : null}

          <div className="zoomer">
            <i
              className="reset-zoom material-icons tooltipped"
              data-position="right"
              data-tooltip="Reset zoom"
              onClick={this.resetZoom}
            >
              zoom_out_map
            </i>
            <div className="range-field">
              <input
                ref="zoomerRef"
                type="range"
                step="0.1"
                min="1" max="100"
                value={this.zoomScale.invert(scale)}
                onChange={() => this.scaleTo(this.zoomScale(this.refs.zoomerRef.value))}
              />
            </div>
          </div>

          {/* container for materialize css toasts */}
          <div id="toast-container"></div>

          <button
            className="btn-floating btn-large waves-effect waves-light new"
            onClick={(e) => this.onCreateVariable(e, {x: -130, y: -130})}
          >
            <i className="material-icons">add</i>
          </button>
        </div>
      </EnsureLoggedIn>
    );
  }
}

Model.propTypes = {
  // actions
  setPageTitle: React.PropTypes.func.isRequired,
  createVariable: React.PropTypes.func.isRequired,
  changeVariableName: React.PropTypes.func.isRequired,
  // data
  model: React.PropTypes.object.isRequired,
  variables: React.PropTypes.array.isRequired,
  links: React.PropTypes.array.isRequired,
  // aux
  error: React.PropTypes.string,
};

export default Model;
