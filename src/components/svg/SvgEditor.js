/* eslint-disable react/prefer-stateless-function,arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';

class SvgEditor extends React.Component {
  render = () => {
    return (
      <svg>
        <image
          xlinkHref={this.props.imageUrl}
          x="0"
          y="0"
          height={this.props.imageHeight}
          width={this.props.imageWidth}
        />
      </svg>
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

