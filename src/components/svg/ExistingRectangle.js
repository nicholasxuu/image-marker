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
      showButtons: false,
    };
  }

  handleHover = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // show edit and remove button
    this.setState({
      showButtons: true,
    });
  };

  handleUnhover = (e) => {
    console.log('out');
    this.setState({
      showButtons: false,
    });
  };

  handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.removeExistingRectangle(this.props.id);
  };

  handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.editExistingRectangle(this.props.id);
  };

  handleFocus = (e) => {
    console.log('focus');
    e.preventDefault();
    e.stopPropagation();

    this.props.focusExistingRectangle(this.props.id);
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
    let editButtons = null;
    if (this.state.showButtons) {
      editButtons = this.renderEditButtons();
    }
    return [
      <rect
        key="select-body"
        className="exist-select"
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fillOpacity={0}
        strokeWidth={2}
        stroke={this.props.color}
      />,
      <g
        key="select-tag"
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleUnhover}
        onMouseDown={this.handleFocus}
      >
        <rect
          className="exist-select"
          x={this.props.x}
          y={this.props.y}
          height={20}
          width={this.props.width}
          fill={this.props.color}
          fillOpacity={1}
        />
        <text
          x={this.props.x}
          y={this.props.y + 15}
          fontSize={15}
          fill="white"
        >
          {this.props.tagText}
        </text>
        {editButtons}
      </g>,
    ];
  }
}
ExistingRectangle.defaultProps = {
  color: 'green',
};

ExistingRectangle.propTypes = {
  id: PropTypes.number.isRequired,
  tagText: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  color: PropTypes.string,
  editExistingRectangle: PropTypes.func.isRequired,
  removeExistingRectangle: PropTypes.func.isRequired,
  focusExistingRectangle: PropTypes.func.isRequired,
};

export default ExistingRectangle;
