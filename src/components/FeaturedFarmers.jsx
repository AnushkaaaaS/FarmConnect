import React, { useEffect, useState } from 'react';
import './FeaturedFarmers.css';

const FeaturedFarmers = () => {
  const [featuredFarmers, setFeaturedFarmers] = useState([]);

  // Fetch featured farmers from the backend
  useEffect(() => {
    const fetchFeaturedFarmers = async () => {
      try {
        const response = await fetch('https://farmconnect-by0t.onrender.com/api/featured-farmers');
        const data = await response.json();
        setFeaturedFarmers(data);
      } catch (error) {
        console.error('Error fetching featured farmers:', error);
      }
    };

    fetchFeaturedFarmers();
  }, []);

  return (
    <div className="featured-farmers-section">
      <h2>Featured Farmers</h2>
      <div className="more-farmers-description">
        <p>
          Discover more about these dedicated farmers and support their farms by shopping directly from them. Every purchase helps grow their dream!
        </p>
      </div>
      <div className="featured-farmers-cards">
        {featuredFarmers.map((farmer, index) => (
          <div key={farmer._id} className="featured-farmer-card">
            <img
              src="./farmer.jpg" // Default random image
              alt={`${farmer.firstName} ${farmer.lastName}`}
              className="farmer-image"
            />
            <h3 className="farmer-name">
              {farmer.firstName} {farmer.lastName}
            </h3>
            <p className="farmer-description">
              {/* Display different descriptions based on index */}
              {index === 0 && (
                <>
                  {farmer.firstName} is known for growing organic produce with great care. With <strong>{farmer.farmerDetails.totalArea}</strong> acres of land, he specializes in <strong>{farmer.farmerDetails.cropCycle}</strong> crop cycles. His commitment to sustainable farming ensures a rich variety of high-quality crops that nourish the community.
                </>
              )}
              {index === 1 && (
                <>
                  {farmer.firstName} runs a farm that spans across <strong>{farmer.farmerDetails.totalArea}</strong> acres, growing seasonal vegetables and fruits. By using organic fertilizers and environmentally friendly farming techniques, {farmer.firstName} produces fresh, healthy crops. Support {farmer.firstName}'s farm today and experience the taste of nature!
                </>
              )}
              {index === 2 && (
                <>
                  {farmer.firstName} focuses on sustainable agriculture, cultivating crops like <strong>{farmer.farmerDetails.cropCycle}</strong> on his <strong>{farmer.farmerDetails.totalArea}</strong> acre farm. His dedication to eco-friendly practices not only enhances the quality of his produce but also ensures a healthier environment. Support {farmer.firstName}'s mission by buying directly from their farm.
                </>
              )}
            </p>
            <button className="shop-button">Shop from them</button>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default FeaturedFarmers;
