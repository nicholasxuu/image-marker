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
      rawItemList: [],
      userColorMap: {},
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

      if (query.itemlist) {
        newState.rawItemList = JSON.parse(query.itemlist);
      }

      if (query.disabled) {
        newState.disabled = (query.disabled === '1');
      }

      if (query.usercolormap) {
        newState.userColorMap = JSON.parse(query.usercolormap);
      }

      this.setState(newState);
    }
  };

  render = () => {
    return (
      <ImageMarker
        imageUrl={this.state.imageUrl}
        rawItemList={this.state.rawItemList}
        userColorMap={this.state.userColorMap}
        disabled={this.state.disabled}
        onSaveMarkedItemList={this.props.actions.onSaveMarkedItemList}
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
  actions: PropTypes.shape({
    onSaveMarkedItemList: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;

