/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';

class ImageSampler extends React.Component {
  tellParentImageAttributes = () => {
    this.props.setImageAttributes({
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
  setImageAttributes: PropTypes.func.isRequired,
};

export default ImageSampler;

