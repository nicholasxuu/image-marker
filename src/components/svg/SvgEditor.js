/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import ReactResizeDetector from 'react-resize-detector';

class SvgEditor extends React.Component {
  render = () => {
    return (
      <div
        className="svg-box svg-non-element"
        ref={(dom) => { this.svgContainer = dom; }}
        style={{
          touchAction: 'none',
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: '0',
        }}
      >
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />

        <svg>
          <image
            xlinkHref={this.props.imageUrl}
            x="0"
            y="0"
            height={this.props.imageHeight}
            width={this.props.imageWidth}
          />
        </svg>
      </div>
    );
  }
}

SvgEditor.defaultProps = {
};

SvgEditor.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
};

export default SvgEditor;

