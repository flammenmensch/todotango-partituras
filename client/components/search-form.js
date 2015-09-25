import React, { Component, PropTypes } from 'react/addons';

export default class SearchForm extends Component {
  render() {
    return (
      <form className="search-form" onSubmit={this.submitHandler.bind(this)}>
        <input placeholder="Search..." ref="searchInput" className="search-form-input" type="search" />
        <button disabled={this.props.busy} className="search-form-button" type="submit">{ this.props.busy ? 'Searching...' : 'Search' }</button>
      </form>
    );
  }

  submitHandler(event) {
    event.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(this.refs.searchInput.getDOMNode().value);
    }
  }
}

SearchForm.defaultProps = {
  busy: false
};

SearchForm.propTypes = {
  busy: PropTypes.bool,
  onSubmit: PropTypes.func
};
