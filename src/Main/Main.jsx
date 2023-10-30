import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Main.css";

export default function Main() {
  const [newsData, setNewsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://linesnews.onrender.com/api/news-datas"
        );
        setNewsData(response.data.data);

        const uniqueCategories = [
          ...new Set(
            response.data.data.map((data) =>
              formatCategory(data.attributes.category)
            )
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredData(
      newsData.filter(
        (data) =>
          (selectedCategory === "" ||
            formatCategory(data.attributes.category) === selectedCategory) &&
          (searchInput === "" ||
            data.attributes.hashtags
              .toLowerCase()
              .includes(searchInput.toLowerCase()))
      )
    );
  }, [newsData, selectedCategory, searchInput]);

  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="main">
      <div className="main-container">
        <div className="search-field">
          <select className="custom-select" onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            className="custom-input"
            type="text"
            placeholder="Search here..."
            onChange={handleSearchInputChange}
          />
        </div>
        {filteredData.length === 0 && searchInput !== "" ? (
          <p id="not-found">No results found</p>
        ) : (
          filteredData.map((data) => (
            <div className="box" key={data.id}>
              <div className="col-1">
                <img
                  src={data.attributes.newsIcon}
                  alt={data.attributes.headline}
                />
              </div>
              <div className="col-2">
                <h1>{data.attributes.headline}</h1>
                <p>Source: {data.attributes.newsSource}</p>
                <p>
                  Hashtags:{" "}
                  {data.attributes.hashtags.split(",").map((tag) => (
                    <span key={tag.trim()}>#{tag.trim()} </span>
                  ))}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
