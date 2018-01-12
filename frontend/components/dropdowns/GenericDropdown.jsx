import React from 'react';
import UserPlaylistModal from '../modals/UserPlaylistModal';

// This has to be a class component because it is used as a ref.

class GenericDropDown extends React.Component {
  render() {
    const className = this.props.clicked ? 'visible' : 'hidden';

    return(
      <div className={`dropdown-container-${className}`}>
        <ul className='dropdown-list'>
          { this.props.listItems.map((Item, idx) => (
            <Item key={this.props.trackId} trackId={this.props.trackId} isSaved={this.props.isSaved}/>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default GenericDropDown;
