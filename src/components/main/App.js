/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import queryParam from 'query-string';
import ImageMarker from '../../containers/ImageMarkerContainer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: '',
      initialList: null,
      disabled: false,
    };
  }

  componentDidMount = () => {
    const { search } = this.props.location;
    if (search) {
      const query = queryParam.parse(search);
      const newState = {};
      if (query.imageurl) {
        newState.imageUrl = query.imageurl;
      }

      if (query.initlist) {
        newState.initialList = JSON.parse(query.initlist);
      }

      if (query.disabled) {
        newState.disabled = (query.disabled === '1');
      }

      this.setState(newState);
    }
  };

  render = () => {
    return (
      <ImageMarker
        imageUrl={this.state.imageUrl}
        initialList={this.state.initialList}
        disabled={this.state.disabled}
      />
    );
  }
}

App.defaultProps = {
  location: {
    search: null,
  },
};

App.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

export default App;

