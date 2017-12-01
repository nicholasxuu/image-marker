/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ImageSampler from '../helper/ImageSampler';
import SvgEditor from '../svg/SvgEditor';

class ImageMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageReady: false,
      imageHeight: 0,
      imageWidth: 0,
    };
  }

  setImageAttributes = (attributes) => {
    if (attributes.height && attributes.width) {
      this.setState({
        imageReady: true,
        imageHeight: attributes.height,
        imageWidth: attributes.width,
      });
      return;
    }
    console.warn('weird attribute found: ', attributes);
  };

  render = () => {
    if (!this.props.imageUrl) {
      return null;
    }

    let svgEditor = null;
    if (this.state.imageReady) {
      svgEditor = (<SvgEditor
        key="svg-editor"
        initialList={this.props.initialList}
        disabled={this.props.disabled}
        imageUrl={this.props.imageUrl}
        imageHeight={this.state.imageHeight}
        imageWidth={this.state.imageWidth}
        onSave={this.props.actions.onSave}
      />);
    }
    return (
      <FullSizeContainer>
        <ImageSampler
          imageUrl={this.props.imageUrl}
          onReady={this.setImageAttributes}
        />
        {svgEditor}
      </FullSizeContainer>
    );
  }
}

const FullSizeContainer = styled.div`
  height: 100%;
  width: 100%;
`;

ImageMarker.defaultProps = {
  initialList: [],
  disabled: false,
};

ImageMarker.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  initialList: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }),
  ),
  disabled: PropTypes.bool,
  actions: PropTypes.shape({
    onSave: PropTypes.func.isRequired,
  }).isRequired,
};

export default ImageMarker;

