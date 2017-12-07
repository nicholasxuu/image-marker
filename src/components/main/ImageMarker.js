/* eslint-disable react/prefer-stateless-function,arrow-body-style,react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Immutable from 'immutable';
import ImageSampler from '../helper/ImageSampler';
import SvgEditor from '../svg/SvgEditor';
import { getRandomId } from '../../utils/RandomUtils';

class ImageMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imageReady: false,
      imageHeight: 0,
      imageWidth: 0,
      markedItemList: this.getMarkedItemList(props.rawItemList, props.userColorMap),
    };
  }

  componentWillReceiveProps = (nextProps) => {
    // update state.markedItemList if related props changed.
    if (
      JSON.stringify(nextProps.userColorMap) !== JSON.stringify(this.props.userColorMap) ||
      JSON.stringify(nextProps.rawItemList) !== JSON.stringify(this.props.rawItemList)
    ) {
      const markedItemList = this.getMarkedItemList(
        nextProps.rawItemList,
        nextProps.userColorMap,
      );
      this.setState({
        markedItemList,
      });
    }
  };

  getMarkedItemList = (itemList, userColorMap) => {
    let markedItemList = Immutable.List();

    itemList.forEach((currItem) => {
      const item = currItem;
      if (!item.id) {
        item.id = getRandomId();
      }
      if (!item.tagText) {
        item.tagText = '';
      }
      if (
        item.user &&
        userColorMap &&
        userColorMap[item.user]
      ) {
        item.color = userColorMap[item.user];
      } else {
        item.color = 'green';
      }

      markedItemList = markedItemList.push(item);
    });

    return markedItemList;
  };

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
        disabled={this.props.disabled}
        imageUrl={this.props.imageUrl}
        imageHeight={this.state.imageHeight}
        imageWidth={this.state.imageWidth}
        userColorMap={this.state.userColorMap}
        markedItemList={this.state.markedItemList}
        onSaveMarkedItemList={this.props.onSaveMarkedItemList}
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
  disabled: false,
  userColorMap: {},
  rawItemList: [],
};

ImageMarker.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  rawItemList: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    user: PropTypes.string,
  })),
  userColorMap: PropTypes.object,
  disabled: PropTypes.bool,
  onSaveMarkedItemList: PropTypes.func.isRequired,
};

export default ImageMarker;

