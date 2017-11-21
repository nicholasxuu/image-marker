/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * When hover, show edit button for activate or delete
 * When clicked, pass through for parent actions.
 */
class ExistingRectangle extends React.Component {
  // todo:

  render = () => {
    return (
      <rect
        key={this.props.id}
        className="active-select"
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fillOpacity={0}
        strokeWidth={2}
        stroke={this.props.stroke}
      />
    );
  }
}
ExistingRectangle.defaultProps = {
  stroke: 'green',
};

ExistingRectangle.propTypes = {
  id: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string,
};

export default ExistingRectangle;
