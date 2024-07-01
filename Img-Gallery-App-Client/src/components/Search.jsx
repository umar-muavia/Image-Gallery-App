import React, { useState } from "react";

function Search({ onSearch}) {
  const [searchData, setSearchData] = useState("");

  const handleChange = (e) => {
    setSearchData(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchData); /// Argument
    setSearchData("")
  };

  return (
    <>
      <div className="search-div">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Search"
              value={searchData}
              onChange={handleChange}
            />
            <button className="btn btn-success" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Search;
