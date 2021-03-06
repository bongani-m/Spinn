import { combineReducers } from 'redux';
import { LOGOUT } from '../actions/session_actions';
import merge from 'lodash/merge';
import {
  RECEIVE_PLAYLISTS,
  RECEIVE_PLAYLIST,
  RECEIVE_CREATED_PLAYLIST,
  RECEIVE_MODAL_PLAYLISTS,
  REMOVE_PLAYLISTS,
  DELETE_PLAYLIST
} from '../actions/playlist_actions';
import { RECEIVE_PLAYLIST_TRACK_SAVE } from '../actions/track_actions';
import { RECEIVE_SEARCH_RESULTS } from '../actions/search_actions';
import { RECEIVE_USER } from '../actions/user_actions';

const initialState = {
  currentUser: {},
  byId: {}
};

const PlaylistsReducer = (state = initialState, action) => {
  Object.freeze(state);
  let newState;
  switch(action.type) {
    case RECEIVE_PLAYLISTS:
    case RECEIVE_USER:
      newState = merge({}, state, { byId: action.playlists });
      return newState;
    case RECEIVE_PLAYLIST:
    case RECEIVE_CREATED_PLAYLIST:
      let newId = { byId:  { [action.data.playlist.id]: action.data.playlist } };
      newState = merge({}, state, newId);
      return newState;
    case REMOVE_PLAYLISTS:
      newState = Object.assign({}, state, initialState);
      return newState;
    case RECEIVE_PLAYLIST_TRACK_SAVE:
      newState = merge({}, state);

      if (state.byId[action.data.playlistId] && state.byId[action.data.playlistId].trackIds) {
        newState.byId[action.data.playlistId].trackIds.push(action.data.trackId);
        newState.byId[action.data.playlistId].imageUrl = action.data.imageUrl;
      }

      return newState;
    case RECEIVE_SEARCH_RESULTS:
      newState = merge({}, state, { byId: action.data.playlists });
      return newState;
    case LOGOUT:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
};


export default PlaylistsReducer;
