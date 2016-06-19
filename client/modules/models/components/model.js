import React from 'react';
import {scaleLinear, zoom, select} from 'd3';
// import {event as currentEvent} from 'd3';
import Variable from '../components/variable';
import EnsureLoggedIn from '../../users/containers/ensure_logged_in';

class Model extends React.Component {
  constructor(props) {
    super(props);
    this.createVariable = this.createVariable.bind(this);
    this.zoomTo = this.zoomTo.bind(this);

    // these won't change
    this.scaleExtent = [0.02, 5];
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
    this.canvas.call(this.zoom);
  }

  select(id) {
    this.setState({
      selected: id,
    });
  }

  zoomTo(newScale) {
    this.zoom.scaleTo(this.canvas, newScale);
  }

  createVariable(event, offset) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const pt = (event.changedTouches && event.changedTouches[0]) || event;
    const {createVariable, model} = this.props;
    createVariable(
      'New variable',
      pt.clientX + offset.x,
      pt.clientY + offset.y,
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
    const {scale, xScale, yScale} = this.state;

    return (
      <EnsureLoggedIn>
        <div className="single-model">
          <svg className="canvas">
            {variables.map(variable => (
              <Variable
                model={model}
                key={variable._id}
                id={variable._id}
                name={variable.name}
                x={xScale(variable.position.x)}
                y={yScale(variable.position.y)}
              />
            ))}
          </svg>

          <div className="zoomer range-field">
            <input
              ref="zoomerRef"
              type="range"
              step="0.1"
              min="1" max="100"
              value={this.zoomScale.invert(scale)}
              onChange={() => this.zoomTo(this.zoomScale(this.refs.zoomerRef.value))}
            />
          </div>

          <button
            className="btn-floating btn-large waves-effect waves-light new"
            onClick={(e) => this.createVariable(e, {x: -100, y: -100})}
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
};

export default Model;
