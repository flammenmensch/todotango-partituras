import React, { Component, PropTypes } from 'react/addons';

export default class SearchForm extends Component {
  render() {
    if (this.props.items.length === 0) {
      return (<p>No results...</p>);
    }

    const listItems = this._createListItems(this.props.items);

    return (
      <ul className="search-result-list">
        {listItems}
      </ul>
    );
  }

  _createListItems(items) {
    return items.map((item, idx) => (
      <li key={idx}>
        <a href={`/api/public/partitura/${item.objectId}/export`} target="_blank" title={item.title}>
          <div className="search-result-list-item">
            <img className="search-result-list-item-cover" src={item.cover} alt={item.title} />
            <p className="search-result-list-item-title">{item.title}</p>
          </div>
        </a>
      </li>
    ));
  }
}

SearchForm.defaultProps = {
  items: []
};

SearchForm.propTypes = {
  items: PropTypes.array,
  onSelect: PropTypes.func
};
