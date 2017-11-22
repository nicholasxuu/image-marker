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

    console.log('constructing', props.x, props.y);

    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      pending: props.pending,

      dragging: false,
      panX: null,
      panY: null,

      tagText: props.tagText,
    };

    this.tagInput = null;
  }

  componentDidMount = () => {
    this.focusInput();
  };

  componentWillReceiveProps = (props) => {
    console.log('receiving props', props.x, props.y);
    let { tagText } = this.state;
    if (props.tagText) {
      // eslint-disable-next-line prefer-destructuring
      tagText = props.tagText;
    }
    this.setState({
      tagText,
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

      // console.log('box click start');

      this.setState({
        dragging: true,
      });
    }
  };

  onClickEnd = (e) => {
    e.preventDefault();
    if (this.state.dragging) {
      e.stopPropagation();

      this.props.setActiveRectangle(
        this.state.x,
        this.state.y,
        this.state.width,
        this.state.height,
      );

      this.focusInput();

      this.setState({
        dragging: false,
        panX: null,
        panY: null,
      });
    }
  };

  onClickMove = (e) => {
    e.preventDefault();

    if (this.state.dragging) {
      e.stopPropagation();

      // console.log('box click move');

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

  clearState = () => {
    this.setState({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      pending: false,

      dragging: false,
      panX: null,
      panY: null,

      tagText: '',
    });
  };

  focusInput = () => {
    if (this.tagInput !== null) {
      this.tagInput.focus();
      this.tagInput.setSelectionRange(this.state.tagText.length, this.state.tagText.length);
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

  submitTaggedRectangle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.clearState();

    this.props.submitTaggedRectangle(
      this.state.tagText,
      this.state.x,
      this.state.y,
      this.state.width,
      this.state.height,
    );
  };

  cancelTaggedRectangle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.clearState();

    this.props.cancelTaggedRectangle();
  };

  handleKeyPress = (e) => {
    switch (e.keyCode) {
      case 27: // escape
        this.cancelTaggedRectangle(e);
        break;
      case 13: // enter
        this.submitTaggedRectangle(e);
        break;
      default:
    }
  };

  render = () => {
    let nameTag = null;
    if (!this.state.pending) {
      nameTag = [
        <foreignObject
          key="tagInput"
          x={this.state.x}
          y={this.state.y}
          width={150}
          height={20}
          style={{
            zIndex: 100,
          }}
          onMouseDown={this.stopPropagation}
        >
          <form
            style={{
              width: '150px',
              height: '20px',
            }}
          >
            <input
              type="text"
              value={this.state.tagText}
              onChange={this.updateTagText}
              ref={(dom) => { this.tagInput = dom; }}
              style={{
                width: '110px',
                height: '20px',
                zIndex: 101,
                cursor: 'text',
                border: 0,
                margin: 0,
                padding: 0,
              }}
              onKeyDown={this.handleKeyPress}
            />
            <button
              onClick={this.submitTaggedRectangle}
              style={{
                width: '20px',
                height: '20px',
                zIndex: 101,
                border: 0,
                margin: 0,
                padding: 0,
              }}
            >
              &#x2713;
            </button>
            <button
              onClick={this.cancelTaggedRectangle}
              style={{
                width: '20px',
                height: '20px',
                zIndex: 101,
                border: 0,
                margin: 0,
                padding: 0,
              }}
            >
              &times;
            </button>
          </form>
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
  tagText: '',
  color: 'red',
  pending: false,
};

ActiveRectangle.propTypes = {
  tagText: PropTypes.string,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pending: PropTypes.bool,
  color: PropTypes.string,
  getFinalScaleMultiplier: PropTypes.func.isRequired,
  setActiveRectangle: PropTypes.func.isRequired,
  submitTaggedRectangle: PropTypes.func.isRequired,
  cancelTaggedRectangle: PropTypes.func.isRequired,
};

export default ActiveRectangle;
