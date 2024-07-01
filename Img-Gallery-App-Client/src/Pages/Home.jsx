import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import Search from "../components/Search";
import UploadButton from "../components/UploadButton";
import ImagesBtn from "../components/ImagesBtn";

function Home() {
  const [images, setImages] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      setLoading(true); // Set loading to true before fetching
      const response = await axios.get("http://localhost:5000/images");
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSearchInput = (userInput) => {
    // userInput / parameter
    setSearchInput(userInput);
  };

  const handleShowAllImages = () => {
    setSearchInput("");
  };

  const filteredImages = images.filter(
    (image) => image.category.toLowerCase().includes(searchInput.toLowerCase()) // searchInput
  );
  console.log("Filtered Images:", filteredImages);
  console.log("Search Term:", searchInput);

  return (
    <div className="container">
      <h2>Image Gallery App</h2>
      <div className="btn-search-div">
        <div className="home-btn-div">
          <UploadButton />
          <ImagesBtn AllImages={handleShowAllImages} />
        </div>
        <Search onSearch={handleSearchInput} />
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : filteredImages.length === 0 ? (
        <h5 className="display-message">No Images are Here</h5>
      ) : (
        <Card
          images={filteredImages}
          onDeleteSuccess={fetchImages}
        />
      )}
    </div>
  );
}

export default Home;
