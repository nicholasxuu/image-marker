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

      tagText: '',
    };

    this.tagInput = null;
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

  componentDidUpdate = (prevProps) => {
    if (this.props.pending === false && prevProps.pending === true) {
      this.focusInput();
    }
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

    if (this.tagInput !== null) {
      this.tagInput.focus();
    }

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

  focusInput = () => {
    if (this.tagInput !== null) {
      this.tagInput.focus();
    }
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  updateTagText = (e) => {
    this.setState({
      tagText: e.currentTarget.value,
    });
  };

  render = () => {
    let nameTag = null;
    if (!this.state.pending) {
      nameTag = [
        <foreignObject
          key="tagInput"
          x={this.state.x}
          y={this.state.y}
          width={100}
          height={20}
          style={{
            zIndex: 100,
          }}
        >
          <input
            type="text"
            value={this.state.tagText}
            onChange={this.updateTagText}
            ref={(dom) => { this.tagInput = dom; }}
            style={{
              width: '100px',
              height: '20px',
              zIndex: 101,
              cursor: 'text',
            }}
            onMouseDown={this.stopPropagation}
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
