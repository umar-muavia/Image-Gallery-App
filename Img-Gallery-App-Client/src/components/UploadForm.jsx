import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("file", e.target.files);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleUpload = async () => {
    // Check if either file or category is missing
    if (!file || !category) {
      console.log("Please select both file and category");
      return;
    }
    const formData = new FormData(); // create a new FormData object
    formData.append("file", file); // "file" => Yeh key hai jo specify kar rhi hai ke yeh data file hai. like type
    formData.append("category", category); // "category" => Yeh key hai jo specify kar rhi hai ke yeh data category hai. like type
    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );
      console.log(response.data);
      setFile(null);
      setCategory("");
      fileInputRef.current.value = "";
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCancel = async () => {
    navigate("/");
  };

  return (
    <>
      <div className="card upload-form-div">
        <div className="label-input-div">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter image category"
              value={category}
              onChange={handleCategoryChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">Upload File</label>
            <input
              type="file"
              className="form-control-file"
              id="file"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
          <div className="btn-div">
            <button
              className="btn btn-primary btn-upload"
              onClick={handleUpload}
            >
              Upload
            </button>
            <button
              className="btn btn-primary btn-upload"
              onClick={handleCancel}
            >
              Cencel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadForm;
