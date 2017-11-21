/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import TouchUtils from '../../utils/TouchUtils';

/**
 * Editable rectangle
 * allow drag to pan.
 * four corners have clickable item to adjust dimensions.
 */
class ActiveRectangle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      pending: props.pending,

      dragging: false,
      panX: null,
      panY: null,
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      pending: props.pending,
    });
  };

  onClickStart = (e) => {
    e.preventDefault();

    if (e.button === 0) {
      e.stopPropagation();

      console.log('box click start');

      this.setState({
        dragging: true,
      });
    }
  };

  onClickEnd = (e) => {
    e.preventDefault();

    this.props.setActiveRectangle(
      this.state.x,
      this.state.y,
      this.state.width,
      this.state.height,
    );

    this.setState({
      dragging: false,
      panX: null,
      panY: null,
    });
  };

  onClickMove = (e) => {
    e.preventDefault();

    if (this.state.dragging) {
      e.stopPropagation();

      console.log('box click move');

      const nextState = {};
      const currPointer = TouchUtils.getCursorScreenPoint(e);

      // Take the delta where we are minus where we came from.
      if (this.state.panX !== null && this.state.panY !== null) {
        const scaleMultiplier = this.props.getFinalScaleMultiplier();

        const svgDistanceX = (currPointer.x - this.state.panX) / scaleMultiplier;
        const svgDistanceY = (currPointer.y - this.state.panY) / scaleMultiplier;

        // Pan using the deltas
        nextState.x = this.state.x + svgDistanceX;
        nextState.y = this.state.y + svgDistanceY;
      }

      nextState.panX = currPointer.x;
      nextState.panY = currPointer.y;

      // Update the state
      this.setState(nextState);
    }
  };

  renderCornerAdjuster = () => {
    return [
      <rect
        key="activeRectTop"
        x={(this.state.x + (this.state.width / 2)) - 5}
        y={this.state.y - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectLeft"
        x={this.state.x - 5}
        y={(this.state.y + (this.state.height / 2)) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectBottom"
        x={(this.state.x + (this.state.width / 2)) - 5}
        y={(this.state.y + this.state.height) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectRight"
        x={(this.state.x + this.state.width) - 5}
        y={(this.state.y + (this.state.height / 2)) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
    ];
  };

  renderEdgeAdjuster = () => {
    return [
      <rect
        key="activeRectTopLeft"
        x={this.state.x - 5}
        y={this.state.y - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectTopRight"
        x={(this.state.x + this.state.width) - 5}
        y={this.state.y - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectBottomLeft"
        x={this.state.x - 5}
        y={(this.state.y + this.state.height) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectBottomRight"
        x={(this.state.x + this.state.width) - 5}
        y={(this.state.y + this.state.height) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
    ];
  };

  stopPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render = () => {
    let nameTag = null;
    if (!this.state.pending) {
      nameTag = [
        <rect
          x={this.state.x}
          y={this.state.y}
          width={100}
          height={20}
          fill={this.props.color}
          onMouseOver={this.stopPropagation}
          onFocus={this.stopPropagation}
        />,
        <foreignObject
          x={this.state.x}
          y={this.state.y}
          width={100}
          height={20}
          style={{
            zIndex: 100,
            cursor: 'text',
          }}
        >
          <input
            type="text"
          />
        </foreignObject>,
      ];
    }

    return [
      <rect
        key="activeRect"
        className="active-select"
        x={this.state.x}
        y={this.state.y}
        width={this.state.width}
        height={this.state.height}

        fillOpacity={0}
        stroke={this.props.color}
        strokeWidth={2}

        onMouseDown={this.onClickStart}
        onMouseMove={this.onClickMove}
        onMouseUp={this.onClickEnd}

        style={{
          cursor: 'move',
          zIndex: 20,
        }}
      />,
      nameTag,
    ];
  }
}
ActiveRectangle.defaultProps = {
  color: 'green',
  pending: false,
};

ActiveRectangle.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pending: PropTypes.bool,
  color: PropTypes.string,
  getFinalScaleMultiplier: PropTypes.func.isRequired,
  setActiveRectangle: PropTypes.func.isRequired,
};

export default ActiveRectangle;
