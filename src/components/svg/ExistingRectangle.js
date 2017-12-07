/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * When hover, show edit button for activate or delete
 * When clicked, pass through for parent actions.
 */
class ExistingRectangle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlight: false,
    };
  }

  /**
   * When hover header bar, show edit and remove buttons
   * @param e
   */
  handleHover = (e) => {
    if (this.props.disabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    // show edit and remove button
    this.setState({
      highlight: true,
    });
  };

  /**
   * When leave hover header bar, hide edit and remove buttons
   * @param e
   */
  handleUnhover = (e) => {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      highlight: false,
    });
  };

  /**
   * When click delete button, tell parent to delete.
   * @param e
   */
  handleDelete = (e) => {
    if (this.props.disabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    this.props.onRemove(this.props.id);
  };

  /**
   * When click edit button, tell parent to use active rectangle for it.
   * @param e
   */
  handleEdit = (e) => {
    if (this.props.disabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    this.props.onEdit(this.props.id);
  };

  /**
   * When click header bar, tell parent to focus it.
   * Note: will not work if header bar is behind another existing one's body.
   *     even if the body is transparent. So, can be a bit confusing.
   * @param e
   */
  handleFocus = (e) => {
    if (this.props.disabled) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    this.props.onFocus(this.props.id);
  };

  renderEditButtons = () => {
    return (
      <foreignObject
        key="tagInput"
        x={(this.props.x + this.props.width) - 40}
        y={this.props.y}
        width={40}
        height={20}
        style={{
          zIndex: 100,
        }}
        onMouseDown={this.stopPropagation}
      >
        <button
          style={{
            width: '20px',
            height: '20px',
            zIndex: 101,
            border: 0,
            margin: 0,
            padding: 0,
          }}
          onClick={this.handleEdit}
        >
          &#9998;
        </button>
        <button
          style={{
            width: '20px',
            height: '20px',
            zIndex: 101,
            border: 0,
            margin: 0,
            padding: 0,
          }}
          onClick={this.handleDelete}
        >
          &times;
        </button>
      </foreignObject>);
  };

  render = () => {
    // let editButtons = null;
    // if (this.state.highlight) {
    //   editButtons = this.renderEditButtons();
    // }
    return [
      <rect
        key="select-body"
        className="exist-select"
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fillOpacity={0}
        strokeWidth={this.state.highlight ? 3 : 2}
        stroke={this.props.color}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleUnhover}
        onDoubleClickCapture={this.handleEdit}
      />,
      <g
        key="select-tag"
        // onMouseDown={this.handleFocus}
      >
        {/*<rect*/}
          {/*className="exist-select"*/}
          {/*x={this.props.x}*/}
          {/*y={this.props.y}*/}
          {/*height={20}*/}
          {/*width={this.props.width}*/}
          {/*fill={this.props.color}*/}
          {/*fillOpacity={0.5}*/}
        {/*/>*/}
        <text
          x={this.props.x}
          y={this.props.y + 15}
          fontSize={15}
          fontWeight={900}
          fill="black"
          strokeWidth={1}
          stroke="white"
        >
          {this.props.tagText}
        </text>
        {/*{editButtons}*/}
      </g>,
    ];
  }
}

ExistingRectangle.defaultProps = {
  color: 'green',
  disabled: false,
};

ExistingRectangle.propTypes = {
  id: PropTypes.number.isRequired,
  tagText: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
};

export default ExistingRectangle;
