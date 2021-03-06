import React from 'react';
import { connect } from 'react-redux';
import { fetchResults, clearSearchResults } from '../../actions/search_actions';


class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.debounceFetch = this.debounceFetch.bind(this);
  }


  handleChange(e) {
    clearTimeout(this.fetch);
    this.props.clearSearchResults();

    this.setState({ query: e.currentTarget.value }, this.debounceFetch);
  }


  componentWillUnmount() {
    this.props.clearSearchResults();
  }

  debounceFetch() {
    const { query } = this.state;

    if (query) {
      this.fetch = setTimeout(() => {
        this.props.fetchResults(this.state);
      }, 350);
    }
  }


  render() {
    return (
      <div className="search-input-container">
        <div className="input-heading-wrapper">
          <span className="input-header">Search for an Artist, Song, Album or Playlist</span>
        </div>
        <input
          className="search-input-field"
          onChange={this.handleChange}
          placeholder="Start typing..."
          type="text"
          value={this.state.query}
          ></input>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  fetchResults: query => dispatch(fetchResults(query)),
  clearSearchResults: () => dispatch(clearSearchResults())
});

export default connect(null, mapDispatchToProps)(SearchForm);
