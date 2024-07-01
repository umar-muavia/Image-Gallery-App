import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Edit() {
  const { id } = useParams(); // current URL ke parameters ko extract kar rha han.
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleUpdate = async () => {
    // Check if either file or category is missing
    if (!file || !category) {
      console.log("Please select both file and category");
      return;
    }
    const formData = new FormData();
    formData.append("category", category);
    formData.append("file", file);

    try {
      await axios.put(`http://localhost:5000/images/${id}`, formData);
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  const handleCancel = async () => {
    navigate("/");
  };

  return (
    <>
      <h2>Edit Your Image</h2>
      <div className="card upload-form-div">
        <div className="label-input-div">
          <input
            type="text"
            className="form-control"
            id="category"
            placeholder="Enter image category"
            value={category}
            onChange={handleCategoryChange}
          />
          <input
            type="file"
            className="form-control-file w"
            id="file"
            onChange={handleFileChange}
          />
          <div className="btn-div">
            <button
              className="btn btn-primary btn-upload"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="btn btn-primary btn-upload"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Edit;
