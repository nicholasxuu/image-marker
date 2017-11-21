/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import styled from 'styled-components';
import ImageSampler from '../helper/ImageSampler';
import SvgEditor from '../svg/SvgEditor';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageReady: false,
      imageHeight: 0,
      imageWidth: 0,
    };

    this.imageUrl = '/sample/test.jpg';
  }

  setImageAttributes = (attributes) => {
    if (attributes.height && attributes.width) {
      console.log('setstate'); // debugger to see if it's loaded once evar
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
    let svgEditor = null;
    if (this.state.imageReady) {
      svgEditor = (<SvgEditor
        imageUrl={this.imageUrl}
        imageHeight={this.state.imageHeight}
        imageWidth={this.state.imageWidth}
      />);
    }
    return (
      <FullSizeContainer>
        <ImageSampler
          imageUrl={this.imageUrl}
          setImageAttributes={this.setImageAttributes}
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

App.defaultProps = {
};

App.propTypes = {
};

export default App;

