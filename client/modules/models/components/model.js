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
      zoomTransform: d3.zoomIdentity.toString(),
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
      // attach onMouseDown handler here, because
      // everything else is consumed by d3
      .on('start', this.onCanvasDown)
      .on('zoom', () => {
        this.setState({
          scale: d3.event.transform.k,
          xScale: d3.event.transform.rescaleX(xScale),
          yScale: d3.event.transform.rescaleY(yScale),
          zoomTransform: d3.event.transform.toString(),
        });
      });

    this.eventCatcher = d3.select('svg.canvas .event-catcher');
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
      model._id
    );
  }

  changeVariableName(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const {changeVariableName, model} = this.props;
    const {nameRef} = this.refs.variableName;
    const name = nameRef.value.trim();
    changeVariableName(this.state.selected, name, model._id);
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
    const {scale, selected, zoomTransform} = this.state;

    return (
      <EnsureLoggedIn>
        <div className="single-model">
          <svg className="canvas" ref="canvasRef">
            <rect
              className="event-catcher"
              x="0" y="0"
              width="8000" height="8000"
            />
            <g transform={zoomTransform}>
              {variables.map((variable) => (
                <Variable
                  modelId={model._id}
                  key={variable._id}
                  id={variable._id}
                  name={variable.name}
                  x={variable.position.x}
                  y={variable.position.y}
                  scale={scale}
                  selected={selected === variable._id}
                  selectionCallback={id => {
                    this.setState({selected: id});
                  }}
                  editCallback={this.onVariableEdit}
                />
              ))}
            </g>

            <defs>
              {/* define drop shadow filter for alter use */}
              <filter id="dropshadow" height="130%" width="130%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

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
