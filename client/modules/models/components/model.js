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
    this.createVariable = this.createVariable.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.zoomTo = this.zoomTo.bind(this);

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

    // get main d3 selector
    this.canvas = d3.select('svg.canvas');
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
    this.canvas.call(this.zoom).on('dblclick.zoom', null);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      Material.toast(nextProps.error, 5000, 'toast-error');
    }
  }

  select(id) {
    this.setState({
      selected: id,
    });
  }

  resetZoom() {
    this.canvas.transition().duration(750)
      .call(this.zoom.transform, d3.zoomIdentity);
  }

  zoomTo(newScale, smooth = false) {
    const selection = smooth ? this.canvas.transition().duration(500) : this.canvas;
    this.zoom.scaleTo(selection, newScale);
  }

  createVariable(event, offset) {
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

  render() {
    const {model, variables, links} = this.props;
    const {scale, selected, zoomTransform} = this.state;

    return (
      <EnsureLoggedIn>
        <div className="single-model">
          <svg
            className="canvas"
            onClick={() => this.setState({selected: false})}
          >
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
                />
              ))}
            </g>
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
                onChange={() => this.zoomTo(this.zoomScale(this.refs.zoomerRef.value))}
              />
            </div>
          </div>

          {/* container for materialize css toasts */}
          <div id="toast-container"></div>

          <button
            className="btn-floating btn-large waves-effect waves-light new"
            onClick={(e) => this.createVariable(e, {x: -130, y: -130})}
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
