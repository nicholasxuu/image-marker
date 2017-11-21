/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';
import SvgUtils from '../../utils/SvgUtils';
import TouchUtils from '../../utils/TouchUtils';
import ActiveRectangle from './ActiveRectangle';

class SvgEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transformMatrix: [1, 0, 0, 1, 0, 0],

      dragging: false, // is dragging
      panX: null, // for pan movement calculation
      panY: null, // for pan movement calculation

      selecting: false,
      selectStartX: 0,
      selectStartY: 0,
      selectX: 0,
      selectY: 0,
      selectWidth: 0,
      selectHeight: 0,
    };

    this.svgState = {
      svgOffsetX: 0,
      svgOffsetY: 0,
      svgZoomScale: 1,
      imageWidth: props.imageWidth,
      imageHeight: props.imageHeight,
      finalMatrix: null,
    };

    /** @type {DOMElement} */
    this.svgBody = null;
    /** @type {DOMElement} */
    this.svgTransformLayer = null;
  }

  componentDidMount = () => {
    this.updateFinalMatrix();
  };

  onClickStart = (e) => {
    e.preventDefault();

    console.log('svg click start');

    if (e.button === 2) {
      // if right click, dragging
      this.setState({
        dragging: true,
      });
    } else if (e.button === 0) {
      // if left click, selecting rectangle
      const { pageX, pageY } = e;

      const { x, y } = SvgUtils.pagePosToSvgPos(
        { x: pageX, y: pageY },
        SvgUtils.matrixMultiply(this.svgState.finalMatrix, this.state.transformMatrix),
      );

      // console.log('select start: ', x, y);

      this.setState({
        selecting: true,
        selectStartX: x,
        selectStartY: y,
        selectColor: 'red',
      });
    }
  };

  onClickEnd = (e) => {
    e.preventDefault();

    this.setState({
      dragging: false,
      panX: null, // unset value
      panY: null, // unset value

      selecting: false,
      selectStartX: 0,
      selectStartY: 0,
    });
  };

  onClickMove = (e) => {
    e.preventDefault();

    if (this.state.dragging) {
      console.log('svg click move');
      const currPointer = TouchUtils.getCursorScreenPoint(e);

      // Take the delta where we are minus where we came from.
      if (this.state.panX !== null && this.state.panY !== null) {
        const scaleMultiplier = this.getFinalScaleMultiplier();

        const svgDistanceX = (currPointer.x - this.state.panX) / scaleMultiplier;
        const svgDistanceY = (currPointer.y - this.state.panY) / scaleMultiplier;

        // Pan using the deltas
        this.svgPan(svgDistanceX, svgDistanceY);
      }

      // Update the state
      this.setState({
        panX: currPointer.x,
        panY: currPointer.y,
      });
    } else if (this.state.selecting) {
      console.log('svg click move');
      const { pageX, pageY } = e;

      const { x, y } = SvgUtils.pagePosToSvgPos(
        { x: pageX, y: pageY },
        SvgUtils.matrixMultiply(this.svgState.finalMatrix, this.state.transformMatrix),
      );

      const selectX = Math.min(x, this.state.selectStartX);
      const selectY = Math.min(y, this.state.selectStartY);
      const selectWidth = Math.abs(x - this.state.selectStartX);
      const selectHeight = Math.abs(y - this.state.selectStartY);

      // console.log(x, this.state.selectStartX, selectX, selectWidth);
      // console.log(y, this.state.selectStartY, selectY, selectHeight);

      this.setState({
        selectX,
        selectY,
        selectWidth,
        selectHeight,
      });
    }
  };

  onResize = () => {
    this.updateFinalMatrix();
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

  setActiveRectangle = (x, y, width, height) => {
    this.setState({
      selectX: x,
      selectY: y,
      selectWidth: width,
      selectHeight: height,
    });
  };

  /**
   * Get matrix for svg element vs viewport
   * @returns {SVGMatrix}
   */
  // eslint-disable-next-line arrow-body-style
  getFinalMatrix = () => {
    if (this.svgTransformLayer) {
      return this.svgTransformLayer.getCTM();
    }
    return null;
  };

  getFinalScaleMultiplier = () => {
    return this.getFinalMatrix().a; // svg box's scale comparing to current viewport size
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

  updateFinalMatrix = () => {
    this.svgState.finalMatrix = this.getFinalMatrix();
  };

  /**
   * refresh transform matrix based on current svg state.
   */
  updateTransformMatrix = () => {
    const transformMatrix = SvgUtils.getTransformMatrix(
      this.svgState.svgOffsetX,
      this.svgState.svgOffsetY,
      this.svgState.svgZoomScale,
      this.svgState.imageWidth,
      this.svgState.imageHeight,
    );

    this.setState({ transformMatrix });
  };

  svgPan = (x, y) => {
    this.svgState.svgOffsetX += x;
    this.svgState.svgOffsetY += y;
    this.updateTransformMatrix();
  };

  svgZoom = (delta) => {
    const currZoomScale = this.svgState.svgZoomScale * (1 + delta);
    if (currZoomScale > 0.1 && currZoomScale < 10) {
      this.svgState.svgZoomScale = currZoomScale;
      this.updateTransformMatrix();
    }
  };

  preventDefault = (e) => {
    e.preventDefault();
  };

  render = () => {
    const viewBox = [0, 0, this.props.imageWidth, this.props.imageHeight].join(' ');

    const activeRect = (<ActiveRectangle
      x={this.state.selectX}
      y={this.state.selectY}
      width={this.state.selectWidth}
      height={this.state.selectHeight}
      pending={this.state.selecting}
      color={this.state.selectColor}
      getFinalScaleMultiplier={this.getFinalScaleMultiplier}
      setActiveRectangle={this.setActiveRectangle}
    />);

    return (
      <SvgContainer
        className="svg-editor"
      >
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />

        <svg
          onContextMenu={this.preventDefault}
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

            {activeRect}
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
  z-index: 0;
`;

SvgEditor.defaultProps = {
};

SvgEditor.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
};

export default SvgEditor;

