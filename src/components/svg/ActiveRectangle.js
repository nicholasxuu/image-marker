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

      tagText: props.tagText,

      dragging: false,
      panX: null,
      panY: null,
    };

    this.tagInput = null;
  }

  /**
   * For when start editing existing one,
   * focus tag input if it exists.
   */
  componentDidMount = () => {
    this.focusInput();

    // eslint-disable-next-line no-undef
    document.addEventListener('keydown', this.handleKeyPress, false);
  };

  /**
   * Update state with updated props from parent.
   * @param {Object} props
   */
  componentWillReceiveProps = (props) => {
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

  /**
   * If stopped resizing, focus on tag input.
   * @param {Object} prevProps
   */
  componentDidUpdate = (prevProps) => {
    if (this.props.pending === false && prevProps.pending === true) {
      // mode 1: let user input tag text after select.
      // this.focusInput();

      // mode 2: save immediately after select.
      this.doSubmitTaggedRectangle();
    }
  };

  componentWillUnmount = () => {
    // eslint-disable-next-line no-undef
    document.removeEventListener('keydown', this.handleKeyPress, false);
  };

  /**
   * handle drag start.
   * @param e
   */
  onClickStart = (e) => {
    e.preventDefault();

    if (e.button === 0) {
      e.stopPropagation();

      this.setState({
        dragging: true,
      });
    }
  };

  /**
   * handle drag end.
   * @param e
   */
  onClickEnd = (e) => {
    e.preventDefault();
    if (this.state.dragging) {
      e.stopPropagation();

      this.props.onChange(
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

  /**
   * handle drag move
   * @param e
   */
  onClickMove = (e) => {
    e.preventDefault();

    if (this.state.dragging) {
      e.stopPropagation();

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

  /**
   * Focus on tag input if it's avaiable.
   */
  focusInput = () => {
    if (this.tagInput !== null) {
      this.tagInput.focus();
      this.tagInput.setSelectionRange(this.state.tagText.length, this.state.tagText.length);
    }
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  /**
   * tag input onChange handler.
   * @param e
   */
  updateTagText = (e) => {
    this.setState({
      tagText: e.currentTarget.value,
    });
  };

  doSubmitTaggedRectangle = () => {
    this.props.onSave(
      this.state.x,
      this.state.y,
      this.state.width,
      this.state.height,
      this.state.color,
      this.state.tagText,
    );

    this.clearState();
  };

  /**
   * Submit result.
   * Send final tagged text to parent.
   * @param e
   */
  submitTaggedRectangle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.doSubmitTaggedRectangle();
  };

  /**
   * Cancel marking.
   * @param e
   */
  cancelTaggedRectangle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.clearState();

    this.props.onCancel();
  };

  deleteTaggedRectangle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.clearState();

    this.props.onDelete();
  };

  /**
   * when user typing in tag input, handle hotkey.
   * @param e
   */
  handleKeyPress = (e) => {
    switch (e.keyCode) {
      case 27: // escape
        e.preventDefault();
        this.cancelTaggedRectangle(e);
        break;
      case 46: // delete
        e.preventDefault();
        this.deleteTaggedRectangle(e);
        break;
      case 13: // enter
        e.preventDefault();
        this.submitTaggedRectangle(e);
        break;
      default:
    }
  };

  render = () => {
    if (!this.props.show) {
      return null;
    }

    let tagInput = null;
    if (!this.state.pending) {
      tagInput = [
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
          <div
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
                width: '108px',
                height: '20px',
                zIndex: 101,
                cursor: 'text',
                border: 0,
                margin: 0,
                padding: 0,
              }}
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
          </div>
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
        strokeWidth={3}
        strokeOpacity={1}

        onMouseDown={this.onClickStart}
        onMouseMove={this.onClickMove}
        onMouseUp={this.onClickEnd}
        onDoubleClick={this.submitTaggedRectangle}

        style={{
          cursor: 'move',
          zIndex: 20,
        }}
      />,
      tagInput,
    ];
  }
}
ActiveRectangle.defaultProps = {
  tagText: '',
  color: 'red',
  pending: false,
  show: false,
};

ActiveRectangle.propTypes = {
  show: PropTypes.bool,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  pending: PropTypes.bool, // resizing
  tagText: PropTypes.string,
  color: PropTypes.string,
  getFinalScaleMultiplier: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ActiveRectangle;
