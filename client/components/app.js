import React, { Component, PropTypes } from 'react/addons';
import { connect } from 'react-redux';
import actions from '../actions';

import Section from './section';
import SearchForm from './search-form';
import SearchResultList from './search-result-list';

class App extends Component {
  render() {
    console.log(this.props);

    return (
      <div>
        <h1>Todotango Partituras</h1>
        <Section>
          <SearchForm busy={this.props.busy} onSubmit={this.onSubmitSearch.bind(this)} />
        </Section>
        <Section>
          <SearchResultList items={this.props.searchResults} />
        </Section>
      </div>
    );
  }

  onSubmitSearch(value) {
    this.props.dispatch(actions.search.search(value));
  }
}

function mapStateToProps(state) {
  const { app, search } = state;

  return {
    ...app, ...search
  };
}

export default connect(mapStateToProps)(App);
