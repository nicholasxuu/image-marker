/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';

class ImageSampler extends React.Component {
  tellParentImageAttributes = () => {
    this.props.onReady({
      height: this.item.naturalHeight,
      width: this.item.naturalWidth,
    });
  };

  render = () => {
    return (
      <img
        ref={(item) => { this.item = item; }}
        src={this.props.imageUrl}
        alt="dummyImgForAttributeDetection"
        onLoad={this.tellParentImageAttributes}
        style={{
          display: 'none',
        }}
      />
    );
  }
}

ImageSampler.defaultProps = {
};

ImageSampler.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default ImageSampler;

