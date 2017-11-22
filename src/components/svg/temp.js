class temp {

  renderCornerAdjuster = () => {
    return [
      <rect
        key="activeRectTop"
        x={(this.state.x + (this.state.width / 2)) - 5}
        y={this.state.y - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectLeft"
        x={this.state.x - 5}
        y={(this.state.y + (this.state.height / 2)) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectBottom"
        x={(this.state.x + (this.state.width / 2)) - 5}
        y={(this.state.y + this.state.height) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectRight"
        x={(this.state.x + this.state.width) - 5}
        y={(this.state.y + (this.state.height / 2)) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
    ];
  };

  renderEdgeAdjuster = () => {
    return [
      <rect
        key="activeRectTopLeft"
        x={this.state.x - 5}
        y={this.state.y - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectTopRight"
        x={(this.state.x + this.state.width) - 5}
        y={this.state.y - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectBottomLeft"
        x={this.state.x - 5}
        y={(this.state.y + this.state.height) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
      <rect
        key="activeRectBottomRight"
        x={(this.state.x + this.state.width) - 5}
        y={(this.state.y + this.state.height) - 5}
        width={10}
        height={10}
        fill="#ffffff"
        fillOpacity={1}
        stroke="#000000"
        strokeWidth={1}
      />,
    ];
  };
}
