import React from 'react';

function ImagesBtn({ AllImages }) {
  return (
    <>
    <button className="btn btn-primary" onClick={AllImages}>All Image</button>
    </>
  );
}

export default ImagesBtn;