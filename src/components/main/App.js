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
    };
  }

  componentDidMount = () => {
    const { search } = this.props.location;
    if (search) {
      const query = queryParam.parse(search);
      if (query.imageurl) {
        this.setState({
          imageUrl: query.imageurl,
        });
      }
    }
  };

  render = () => {
    return (
      <ImageMarker
        imageUrl={this.state.imageUrl}
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

