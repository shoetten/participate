import React from 'react';
import $ from 'jquery';
import {debounce} from 'lodash/fp';
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
import Link from '../containers/link';
import EnsureLoggedIn from '../../users/containers/ensure_logged_in';

class Model extends React.Component {
  constructor(props) {
    super(props);
    this.onCreateVariable = this.onCreateVariable.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
    this.scaleTo = this.scaleTo.bind(this);
    this.onCanvasDown = this.onCanvasDown.bind(this);
    this.onCanvasUp = this.onCanvasUp.bind(this);
    this.onVariableEdit = this.onVariableEdit.bind(this);
    this.changeVariableName = this.changeVariableName.bind(this);
    this.onNewLinkStart = this.onNewLinkStart.bind(this);
    this.onNewLinkMove = this.onNewLinkMove.bind(this);
    this.onNewLinkEnd = this.onNewLinkEnd.bind(this);

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
      canvasSize: {},                             // size and dimensions of svg dom element
      scale: 1,                                   // zoom scale
      xScale,                                     // transforms coordinates in x direction
      yScale,                                     // transforms coordinates in y direction
      editingVariable: false,                     // is a variable name currently beeing edited?
      editBoxPos: {},                             // where the text input field is positioned
      zoomTransform: d3.zoomIdentity.toString(),  // the current css transform
      justAdded: '',                              // id of a just added variable
      varMapper: this.mapVarIds(),                // used for easy access of variables
      creatingLink: false,                        // is a new link is in the making?
      newLinkStartPos: {},
      newLinkPos: {},
    };

    const {setPageTitle, model} = this.props;
    // if user is not authorized, there might be no model
    if (model) {
      setPageTitle(model.title);
    }
  }

  componentDidMount() {
    // get svg dom size
    this.setState({
      canvasSize: this.refs.canvasRef.getBoundingClientRect(),
    });

    this.onResize = debounce(600, () => {
      this.setState({
        canvasSize: this.refs.canvasRef.getBoundingClientRect(),
      });
    });
    window.addEventListener('resize', this.onResize);

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
      // Attach click handler here, because
      // everything else is consumed by d3.
      .on('click', this.onCanvasDown);
    this.eventCatcher.call(this.zoom).on('dblclick.zoom', null);

    // XXX: Dirty fix to get the zoom range slider thumb
    // hidden again in Firefox. Until this is resolved:
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

    // Remap variables, when one is added / removed
    if (this.props.variables.length !== nextProps.variables.length) {
      this.setState({varMapper: this.mapVarIds(nextProps)}, () => {
        // Once the state is updated, check if a new variable was
        // just added and jump to editing mode, if that's the case.

        // XXX: This is a bad way of checking if a new
        // variable was inserted..
        const newId = nextProps.variables[nextProps.variables.length - 1]._id;
        if (this.state.justAdded === newId) {
          this.onVariableEdit(null, newId);
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.creatingLink && !prevState.creatingLink) {
      document.addEventListener('mousemove', this.onNewLinkMove);
      document.addEventListener('touchmove', this.onNewLinkMove);
    } else if (!this.state.creatingLink && prevState.creatingLink) {
      document.removeEventListener('mousemove', this.onNewLinkMove);
      document.removeEventListener('touchmove', this.onNewLinkMove);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onNewLinkStart(event, id) {
    const pt = (event.changedTouches && event.changedTouches[0]) || event;
    const {canvasSize, xScale, yScale} = this.state;

    this.setState({
      creatingLink: id,
      newLinkStartPos: {
        x: xScale.invert(pt.clientX),
        y: yScale.invert(pt.clientY - canvasSize.top),
      },
      newLinkPos: {
        x: xScale.invert(pt.clientX),
        y: yScale.invert(pt.clientY - canvasSize.top),
      },
    });
  }

  onNewLinkMove(event) {
    const pt = (event.changedTouches && event.changedTouches[0]) || event;
    const {canvasSize, xScale, yScale} = this.state;

    this.setState({newLinkPos: {
      x: xScale.invert(pt.clientX),
      y: yScale.invert(pt.clientY - canvasSize.top),
    }});
  }

  onNewLinkEnd(event, id) {
    const {creatingLink} = this.state;
    if (creatingLink) {
      if (event && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.setState({creatingLink: false});

      // prevent self links
      if (creatingLink !== id) {
        const {createLink, variables, model} = this.props;
        const {varMapper} = this.state;
        const fromVar = variables[varMapper[creatingLink]];
        const toVar = variables[varMapper[id]];
        createLink(fromVar, toVar, -1, model._id);
      }
    }
  }

  onCanvasDown() {
    const {select} = this.props;
    select('');
  }

  onCanvasUp() {
    if (this.state.creatingLink) {
      this.setState({creatingLink: false});
    }
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
      {width: 150, height: 30},
      model._id,
      (id) => this.setState({justAdded: id})
    );
  }

  onVariableEdit(event, id) {
    if (event && event.preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }

    const {variables, select} = this.props;
    const {varMapper} = this.state;
    select(id);
    const variable = variables[varMapper[id]];
    const x = variable.position.x;
    const y = variable.position.y;
    const dimensions = variable.dimensions;
    this.setState({
      editingVariable: true,
      editBoxPos: {
        left: x - dimensions.width / 2,
        top: y - dimensions.height / 2,
        width: dimensions.width,
        height: dimensions.height,
      },
    }, () => this.refs.variableName.focus());
  }

  changeVariableName(event) {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const {changeVariableName, variables, model, selected} = this.props;
    const {varMapper} = this.state;
    const {variableName} = this.refs;
    changeVariableName(variables[varMapper[selected]]._id, variableName.value.trim(), model._id);

    this.setState({
      editingVariable: false,
      justAdded: '',
    });
  }

  // This function maps the indices of the variables
  // array to their id's, for faster access.
  mapVarIds(props = this.props) {
    const varMapper = {};
    props.variables.forEach((variable, index) => {
      varMapper[variable._id] = index;
    });
    return varMapper;
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
    const {model, variables, links, selected} = this.props;
    const {
      xScale, yScale, scale, zoomTransform,
      editingVariable, editBoxPos,
      justAdded,
      varMapper,
      creatingLink,
      newLinkStartPos,
      newLinkPos,
    } = this.state;

    return (
      <EnsureLoggedIn>
        <div className="single-model">
          <svg className={`canvas${creatingLink ? ' creating-link' : ''}`} ref="canvasRef">
            <defs>
              <marker id="end-arrow" viewBox="0 -5 10 10" refX="6" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0,-5L10,0L0,5" className="arrow-head"></path>
              </marker>
            </defs>

            <rect
              className="event-catcher"
              x="0" y="0"
              // just make it huge, so it will cover every screen
              width="8000" height="8000"
              onMouseUp={this.onCanvasUp}
            />
            <g transform={zoomTransform}>
              <g className="links">
                {links.map((link) => (
                  <Link
                    modelId={model._id}
                    key={link._id}
                    id={link._id}
                    fromVar={variables[varMapper[link.fromId]]}
                    toVar={variables[varMapper[link.toId]]}
                    controlPointPos={link.controlPointPos}
                    polarity={link.polarity}
                    scale={scale}
                    selected={selected === link._id}
                  />
                ))}
                {creatingLink ?
                  <line
                    x1={newLinkStartPos.x} y1={newLinkStartPos.y}
                    x2={newLinkPos.x} y2={newLinkPos.y}
                    className="new-link"
                    style={{markerEnd: 'url("#end-arrow")'}}
                  />
                : null}
              </g>

              <g className="variables">
                {variables.map((variable) => (
                  <Variable
                    modelId={model._id}
                    key={variable._id}
                    id={variable._id}
                    name={variable.name}
                    position={variable.position}
                    dimensions={variable.dimensions}
                    scale={scale}
                    selected={selected === variable._id}
                    editing={selected === variable._id && editingVariable}
                    editCallback={this.onVariableEdit}
                    newLinkStartCallback={this.onNewLinkStart}
                    newLinkEndCallback={this.onNewLinkEnd}
                  />
                ))}
              </g>
            </g>
          </svg>

          {editingVariable !== false ?
            <form
              onSubmit={this.changeVariableName}
              className="edit-variable"
              style={{
                top: yScale(editBoxPos.top),
                left: xScale(editBoxPos.left),
                width: editBoxPos.width,
                height: editBoxPos.height,
                transform: `scale(${scale})`,
              }}
            >
              <input
                type="text"
                ref="variableName"
                defaultValue={justAdded ? '' : variables[varMapper[selected]].name}
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
  // data
  model: React.PropTypes.object.isRequired,
  variables: React.PropTypes.array.isRequired,
  links: React.PropTypes.array.isRequired,
  // actions
  setPageTitle: React.PropTypes.func.isRequired,
  createVariable: React.PropTypes.func.isRequired,
  changeVariableName: React.PropTypes.func.isRequired,
  createLink: React.PropTypes.func.isRequired,
  select: React.PropTypes.func.isRequired,
  // aux
  error: React.PropTypes.string,
  selected: React.PropTypes.string,
};

export default Model;
