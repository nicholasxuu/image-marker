/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import ImageMarker from '../../containers/ImageMarkerContainer';

class App extends React.Component {
  render = () => {
    return (
      <ImageMarker />
    );
  }
}

App.defaultProps = {
};

App.propTypes = {
};

export default App;

