import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GenericIndexItem from '../featured_playlists/GenericIndexItem';
import { fetchGenre, removeGenres } from '../../actions/genre_actions';

const mapStateToProps = (state, ownProps) => {
  return {
    itemName: ownProps.item.name,
    loading: state.ui.loading,
    imageUrl: ownProps.item.imageUrl,
    id: ownProps.item.id,
    handleClick: () => ownProps.history.push(`/genres/${ownProps.item.id}`)
  };
};


export default withRouter(connect(
  mapStateToProps
)(GenericIndexItem));