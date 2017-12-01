/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * When hover, show edit button for activate or delete
 * When clicked, pass through for parent actions.
 */
class ZoomButtons extends React.Component {
  handleZoomIn = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onZoomIn();
  };

  handleZoomOut = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onZoomOut();
  };

  render = () => {
    return [
      <ZoomInButton
        key="zoominbutton"
        onClick={this.handleZoomIn}
      >
        &#10133;
      </ZoomInButton>,
      <ZoomOutButton
        key="zoomoutbutton"
        onClick={this.handleZoomOut}
      >
        &#10134;
      </ZoomOutButton>,
    ];
  }
}

const ZoomInButton = styled.button`
  position: absolute;
  bottom: 35px;
  right: 10px;
  width: 25px;
  height: 25px;
  font-size: 12px;
`;

const ZoomOutButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  font-size: 12px;
`;

ZoomButtons.defaultProps = {
};

ZoomButtons.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
};

export default ZoomButtons;
