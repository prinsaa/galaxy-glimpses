import React, { useState, useEffect } from "react";
import axios from "axios";

const APIForm = ({ apiKey }) => {
  const [apodData, setApodData] = useState({});
  const [bannedTitleAttributes, setBannedTitleAttributes] = useState([]);
  const [bannedDateAttributes, setBannedDateAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomDate = () => {
    const minDate = new Date("1995-06-16"); //to prevent 400 Bad Request API call

    const today = new Date();

    const timeRange = today - minDate;

    const randomTime = Math.random() * timeRange;
    const randomDate = new Date(minDate.getTime() + randomTime); //(here a certain time is given)cuz this would give you for ex.: 2023-10-09T12:34:56.789Z

    return randomDate.toISOString().split("T")[0]; //split by T and take the first element which is the date
  };

  const getAPOD = async () => {
    setIsLoading(true);
    const date = getRandomDate();

    try {
      const response = await axios.get(
        `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`
      );
      const newApodData = response.data;

      // Check if the new APOD matches any banned attributes
      const isBannedTitle = bannedTitleAttributes.includes(newApodData.title);
      const isBannedDate = bannedDateAttributes.includes(newApodData.date);

      if (isBannedTitle || isBannedDate) {
        // If any attribute is banned, recursively call getAPOD to fetch a new APOD
        getAPOD();
      } else {
        // If none of the attributes are banned, set the new APOD data
        setApodData(newApodData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching APOD:", error);
      setIsLoading(false);
    }
  };

  const handleBanAttribute = (attributeName, attributeValue) => {
    if (attributeName === "title") {
      setBannedTitleAttributes([...bannedTitleAttributes, attributeValue]);
    } else if (attributeName === "date") {
      setBannedDateAttributes([...bannedDateAttributes, attributeValue]);
    }
    getAPOD();
  };

  useEffect(() => {
    getAPOD();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>✨ Galaxy Glimpses ✨</h1>
          <h4>
            Explore the galaxy! Pictures seen below were once selected as NASA's
            Astronomy Picture of the Day!
          </h4>
          <button onClick={getAPOD}>Get New Astronomy Glimpse</button>

          <div id="apod-image-container">
            <img src={apodData.url} alt="Astronomy Picture of the Day" />
          </div>

          <div id="apod-info">
            <h2 style={{ color: "#3399FF" }}>{apodData.title}</h2>
            <p style={{ color: "#FFFFCC" }}>{apodData.date}</p>
            <p>{apodData.explanation}</p>
          </div>

          <div id="ban-list">
            <button
              onClick={() => handleBanAttribute("title", apodData.title)}
              style={{ marginRight: "15px" }}
            >
              Ban Title
            </button>
            <button
              onClick={() => handleBanAttribute("date", apodData.date)}
              style={{ marginRight: "15px" }}
            >
              Ban Date
            </button>

            <h2 style={{ color: "red", marginTop: "60px" }}>Ban List</h2>

            {bannedTitleAttributes.map((attribute) => (
              <li>{attribute}</li>
            ))}

            {bannedDateAttributes.map((attribute) => (
              <li>{attribute}</li>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIForm;
