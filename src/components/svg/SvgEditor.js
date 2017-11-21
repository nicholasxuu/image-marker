/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';

class SvgEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false, // is dragging
      panning: false,
      selectPending: false, // is going to select, but no drag between mouseDown and mouseUp
      panX: null, // for pan movement calculation
      panY: null, // for pan movement calculation
      transformMatrix: [1, 0, 0, 1, 0, 0],
    };

    this.svgBody = null;
    this.svgTransformLayer = null;
  }

  onClickStart = (e) => {

  };

  onClickEnd = (e) => {

  };

  onClickMove = (e) => {

  };

  onResize = (e) => {
    this.updateViewportMatrix();
  };

  onWheel = (e) => {
    e.preventDefault();
    const wheelDeadZone = 2;
    if (e.deltaY < -wheelDeadZone) {
      this.svgZoom(0.05);
    } else if (e.deltaY > wheelDeadZone) {
      this.svgZoom(-0.05);
    }
  };

  /**
   * Get matrix for svg vs viewport.
   * @return {SVGMatrix}
   */
  getViewportMatrix = () => {
    if (this.svgBody) {
      return this.svgBody.getCTM();
    }
    return null;
  };

  getViewportScaleMultiplier = () => {
    return this.getViewportMatrix().a; // svg box's scale comparing to current viewport size
  };

  updateViewportMatrix = () => {
    // todo: I don't think it should change transform matrix
    const vm = this.getViewportMatrix();
    if (vm !== null) {
      this.setState({
        transformMatrix: [vm.a, vm.b, vm.c, vm.d, vm.e, vm.f],
      });
    }
  };

  svgZoom = (delta) => {
    console.log('zoom: ', delta);
    // wip
    const nextTransformMatrix = this.state.transformMatrix;
    nextTransformMatrix[0] = this.state.transformMatrix[0] * (1 + delta);
    nextTransformMatrix[3] = this.state.transformMatrix[3] * (1 + delta);
    this.setState({
      transformMatrix: nextTransformMatrix,
    });
  };

  render = () => {
    const viewBox = [0, 0, this.props.imageWidth, this.props.imageHeight].join(' ');

    return (
      <SvgContainer
        className="svg-editor"
      >
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />

        <svg
          className="cover-svg"
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"

          version="1.1"
          ref={(dom) => { this.svgBody = dom; }}

          onMouseDown={this.onClickStart}
          onMouseMove={this.onClickMove}
          onMouseUp={this.onClickEnd}
          onWheel={this.onWheel}

          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <g
            id="svg-transform-layer"
            ref={(dom) => { this.svgTransformLayer = dom; }}
            transform={`matrix(${this.state.transformMatrix.join(' ')})`}
          >

            <image
              xlinkHref={this.props.imageUrl}
              x="0"
              y="0"
              height={this.props.imageHeight}
              width={this.props.imageWidth}
            />
          </g>
        </svg>
      </SvgContainer>
    );
  }
}

const SvgContainer = styled.div`
  touch-action: none;
  position: relative;
  width: 100%;
  height: 100%;
  zIndex: 0;
`;

SvgEditor.defaultProps = {
};

SvgEditor.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
};

export default SvgEditor;

