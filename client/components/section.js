import React, { Component, PropTypes } from 'react/addons';

export default class Section extends Component {
  render() {
    return (
      <div className="section">
        {this.props.children}
      </div>
    );
  }
}
