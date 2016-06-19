import React from 'react';
import $ from 'jquery';
import {scaleLinear, zoom, zoomIdentity, select} from 'd3';
// import {event as currentEvent} from 'd3';
import Variable from '../components/variable';
import EnsureLoggedIn from '../../users/containers/ensure_logged_in';

class Model extends React.Component {
  constructor(props) {
    super(props);
    this.createVariable = this.createVariable.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.zoomTo = this.zoomTo.bind(this);

    // these won't change
    this.scaleExtent = [0.02, 10];
    this.zoomScale = scaleLinear()
      .domain([1, 100])   // 1 to 100 percent
      .range(this.scaleExtent);

    // set scales for semantic zooming
    const xScale = scaleLinear()
      .domain([0, 1000])
      .range([0, 1000]);
    const yScale = scaleLinear()
      .domain([0, 800])
      .range([0, 800]);

    this.state = {
      scale: 1,
      xScale,
      yScale,
      selected: false,
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
    this.canvas = select('svg.canvas');
    // init the pan & zoom behaviour
    this.zoom = zoom()
      .scaleExtent(this.scaleExtent)
      .on('zoom', () => {
        // XXX: This should be possible through es6 immutable
        // bindings, but somehow it's not..
        const currentEvent = require('d3').event;
        this.setState({
          scale: currentEvent.transform.k,
          xScale: currentEvent.transform.rescaleX(xScale),
          yScale: currentEvent.transform.rescaleY(yScale),
        });
      });
    this.canvas.call(this.zoom).on('dblclick.zoom', null);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error !== this.props.error) {
      // XXX Use with proper import
      Materialize.toast(nextProps.error, 5000, 'toast-error');
    }
  }

  select(id) {
    this.setState({
      selected: id,
    });
  }

  resetZoom() {
    this.canvas.transition().duration(750)
      .call(this.zoom.transform, zoomIdentity);
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
    const {scale, xScale, yScale, selected} = this.state;

    return (
      <EnsureLoggedIn>
        <div className="single-model">
          <svg
            className="canvas"
            onClick={() => this.setState({selected: false})}
          >
            {variables.map(variable => (
              <Variable
                model={model}
                key={variable._id}
                id={variable._id}
                name={variable.name}
                x={xScale(variable.position.x)}
                y={yScale(variable.position.y)}
                selected={selected === variable._id}
                selectionCallback={(event, id) => {
                  event.stopPropagation();
                  this.setState({selected: id});
                }}
              />
            ))}
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
