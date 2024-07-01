import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Card({ images , onDeleteSuccess }) {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/images/${id}`); //api call
      onDeleteSuccess(); // Ask parent component to refresh images
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`); // Navigate to the Edit route
  };

  return (
    <div className="card-div">
      {images.map((image) => (
        <div key={image._id} className="card card-custom">
          <img
            src={`http://localhost:5000/${image.path}`}
            className="card-img-top image-custom"
            alt={image.filename}
          />
          <div className="card-body">
            <h6 className="card-title">Category: {image.category}</h6>
            <div className="buttons-div">
              <button className="btn btn-danger" onClick={() => handleDelete(image._id)}>
                Delete
              </button>
              <button className="btn btn-primary" onClick={() => handleEdit(image._id)}>
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;
