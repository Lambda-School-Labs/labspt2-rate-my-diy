import React from 'react';
import MicroModal from 'react-micro-modal';

const ReviewCard = ({ review }) => {
  return (
    <div>
      <MicroModal
        trigger={(handleOpen) => (
          <div>
            <div>{`@${review.Author.username}`}</div>
            <div>{`${review.timestamp}`}</div>
            <div>{`${review.name}`}</div>
            <button onClick={handleOpen}>View More</button>
          </div>
        )}
        children={(handleClose) => (
          <div>
            <div>
              <div>{`@${review.Author.username}`}</div>
              <div>{`${review.timestamp}`}</div>
              <div>{`${review.name}`}</div>
              <div>{`${review.text}`}</div>
              <span>{`Thumbs Up: ${review.thumbsUp}`}</span>
              <span>{`Thumbs Down: ${review.thumbsDown}`}</span>
            </div>
            <button onClick={handleClose}>Close</button>
          </div>
        )}
      />
    </div>
  );
};

export default ReviewCard;
