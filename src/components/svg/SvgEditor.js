/* eslint-disable no-param-reassign,react/sort-comp */
import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ReactResizeDetector from 'react-resize-detector';
import styled from 'styled-components';
import SvgUtils from '../../utils/SvgUtils';
import TouchUtils from '../../utils/TouchUtils';
import ActiveRectangle from './ActiveRectangle';
import ExistingRectangle from './ExistingRectangle';
import ZoomButtons from './ZoomButtons';
import { getRandomId } from '../../utils/RandomUtils';

class SvgEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transformMatrix: [1, 0, 0, 1, 0, 0],

      dragging: false, // is dragging
      panX: null, // for pan movement calculation
      panY: null, // for pan movement calculation

      selectActive: false,
      selectedItem: null,
      selecting: false,
      selectStartX: 0, // helper for initial drag
      selectStartY: 0, // helper for initial drag
      selectX: 0,
      selectY: 0,
      selectWidth: 0,
      selectHeight: 0,
      selectColor: 'red',

      markedItemList: props.markedItemList,

      disabled: props.disabled,
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

    props.onSaveMarkedItemList(Immutable.List());
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.markedItemList !== this.props.markedItemList) {
      this.setState({
        markedItemList: nextProps.markedItemList,
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.markedItemList !== this.state.markedItemList) {
      this.props.onSaveMarkedItemList(this.state.markedItemList);
    }
  };

  componentDidMount = () => {
    this.updateFinalMatrix();

    // eslint-disable-next-line no-undef
    // document.addEventListener('keydown', this.handleKeyPress, true);
  };

  componentWillUnmount = () => {
    // eslint-disable-next-line no-undef
    // document.removeEventListener('keydown', this.handleKeyPress, true);
  };

  onClickStart = (e) => {
    e.preventDefault();

    if (e.button === 2) {
      // if right click, dragging
      this.setState({
        dragging: true,
      });
    } else if (e.button === 0 && !this.state.disabled) {
      // if left click, selecting rectangle, aka, creating new one
      const { pageX, pageY } = e;

      const { x, y } = SvgUtils.pagePosToSvgPos(
        { x: pageX, y: pageY },
        SvgUtils.matrixMultiply(this.svgState.finalMatrix, this.state.transformMatrix),
      );

      this.setState({
        selecting: true,
        selectActive: false, // don't activate it yet, for double click event
        selectStartX: x,
        selectStartY: y,
        selectWidth: 0,
        selectHeight: 0,
      });
    }
  };

  onClickEnd = (e) => {
    e.preventDefault();

    if (this.state.selecting || this.state.dragging) {
      this.setState({
        dragging: false,
        panX: null, // unset value
        panY: null, // unset value

        selecting: false,
        selectActive: false,
        selectStartX: 0,
        selectStartY: 0,
      });
    }
  };

  onClickMove = (e) => {
    e.preventDefault();

    if (this.state.dragging) {
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
      const { pageX, pageY } = e;

      const { x, y } = SvgUtils.pagePosToSvgPos(
        { x: pageX, y: pageY },
        SvgUtils.matrixMultiply(this.svgState.finalMatrix, this.state.transformMatrix),
      );

      const selectX = Math.min(x, this.state.selectStartX);
      const selectY = Math.min(y, this.state.selectStartY);
      const selectWidth = Math.abs(x - this.state.selectStartX);
      const selectHeight = Math.abs(y - this.state.selectStartY);

      if (this.state.selectActive === false && ((selectWidth + selectHeight) >= 5)) {
        this.setState({
          selectActive: true,
        });
      }

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

  handleZoomIn = () => {
    this.svgZoom(0.3);
  };

  handleZoomOut = () => {
    this.svgZoom(-0.3);
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

  // svg box's scale comparing to current viewport size
  getFinalScaleMultiplier = () => (this.getFinalMatrix().a);

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

  // svg box's scale comparing to current viewport size
  getViewportScaleMultiplier = () => (this.getViewportMatrix().a);

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

  /**
   * Active Rectangle Handling Functions
   */

  saveTaggedRectangle = (x, y, width, height, color, tagText) => {
    if ((width + height) < 5) {
      // mis-click, don't register
      this.clearActiveRectangle();
      return;
    }

    // Yea, I'm a f***ing genius.
    const markedItem = Object.assign(
      {
        id: getRandomId(),
        tagText: '',
      },
      this.state.selectedItem,
      {
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: Math.min(this.props.imageWidth - x, width) + Math.min(0, x),
        height: Math.min(this.props.imageHeight - y, height) + Math.min(0, y),
        color,
        tagText,
      },
    );
    const markedItemList = this.state.markedItemList.push(markedItem);

    this.setState({
      selectActive: false,
      selectedItem: null,
      selectX: 0,
      selectY: 0,
      selectWidth: 0,
      selectHeight: 0,
      markedItemList,
    });
  };

  deleteActiveRectangle = () => {
    this.setState({
      selectActive: false,
      selectedItem: null,
      selectX: 0,
      selectY: 0,
      selectWidth: 0,
      selectHeight: 0,
    });
  };

  clearActiveRectangle = () => {
    if (this.state.selectedItem !== null) {
      // add it back
      const markedItemList = this.state.markedItemList.push(this.state.selectedItem);

      this.setState({
        selectActive: false,
        selectedItem: null,
        selectX: 0,
        selectY: 0,
        selectWidth: 0,
        selectHeight: 0,
        markedItemList,
      });
    } else {
      this.setState({
        selectActive: false,
        selectedItem: null,
        selectX: 0,
        selectY: 0,
        selectWidth: 0,
        selectHeight: 0,
      });
    }
  };

  /**
   * Existing Marked Rectangle Handling Functions
   */

  editExistingRectangle = (id) => {
    const target = this.state.markedItemList.find(item => (item.id === id));
    if (!target) {
      console.warn(`id: ${id} not found`);
      return;
    }
    this.setState({
      selectActive: true,
      selecting: false,
      selectX: target.x,
      selectY: target.y,
      selectWidth: target.width,
      selectHeight: target.height,
      selectedItem: target,
      markedItemList: this.state.markedItemList
        .filter(item => (
          item.id !== id
        )),
    });
  };

  removeExistingRectangle = (id) => {
    this.setState({
      markedItemList: this.state.markedItemList
        .filter(item => (
          item.id !== id
        )),
    });
  };

  focusExistingRectangle = (id) => {
    const target = this.state.markedItemList.find(item => (item.id === id));
    this.setState({
      markedItemList: this.state.markedItemList
        .filter(item => (
          item.id !== id
        ))
        .push(target),
    });
  };

  // handleKeyPress = (e) => {
  //   if (e.keyCode === 83 && e.ctrlKey) {
  //     e.preventDefault(); // prevent save page action by browser
  //
  //     // ctrl+s for save
  //     this.props.onSave(this.props.imageUrl, this.state.markedItemList);
  //
  //     return false;
  //   }
  //   return true;
  // };

  render = () => {
    const viewBox = [0, 0, this.props.imageWidth, this.props.imageHeight].join(' ');

    return (
      <SvgContainer
        className="svg-editor"
      >
        <ZoomButtons
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
        />

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

            {/* existing marked rectangles */}
            {this.state.markedItemList.map(rect => (
              <ExistingRectangle
                key={rect.id}
                id={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                tagText={rect.tagText}
                color={rect.color}
                onEdit={this.editExistingRectangle}
                onRemove={this.removeExistingRectangle}
                onFocus={this.focusExistingRectangle}
              />
            ))}

            {/* active mark rectangle */}
            <ActiveRectangle
              show={this.state.selectActive}
              x={this.state.selectX}
              y={this.state.selectY}
              width={this.state.selectWidth}
              height={this.state.selectHeight}
              pending={this.state.selecting}
              color={this.state.selectColor}
              getFinalScaleMultiplier={this.getFinalScaleMultiplier}
              onChange={this.setActiveRectangle}
              onSave={this.saveTaggedRectangle}
              onCancel={this.clearActiveRectangle}
              onDelete={this.deleteActiveRectangle}
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
  z-index: 0;
`;

SvgEditor.defaultProps = {
  markedItemList: Immutable.List(),
  disabled: false,
};

SvgEditor.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  // onSave: PropTypes.func.isRequired, // no longer needed, use global to save result
  markedItemList: ImmutablePropTypes.listOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    tagText: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })),
  disabled: PropTypes.bool,
  onSaveMarkedItemList: PropTypes.func.isRequired,
};

export default SvgEditor;

