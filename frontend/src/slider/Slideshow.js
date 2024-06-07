import React, { useState, useEffect } from "react";
import { Zoom } from 'react-slideshow-image';

import "react-slideshow-image/dist/styles.css";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import imageSrc from './images/copy-space-teenage-boy.jpg';
import imageSrc1 from './images/expressive-young-lady-posing-studio.jpg';
import imageSrc2 from './images/expressive-young-woman-posing.jpg';

const buttonStyle = {
  width: "30px",
  background: "none",
  border: "0px",
  color: "white",
};

const properties = {
  prevArrow: (
    <button style={buttonStyle}>
      <IoIosArrowBack size={24} />
    </button>
  ),
  nextArrow: (
    <button style={buttonStyle}>
      <IoIosArrowForward size={24} />
    </button>
  ),
};

const slideImageContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "100vh",
  width: "100%",
};

const slideContentStyle = {
  position: "absolute",
  top: "31%",
  left: "9%",
  color: "Black",
  zIndex: "2", // 'zIndex' should be camelCase
};

// Slide images data
const slideImages = [
  {
    url: imageSrc1, // Use the imported image directly
    title: "Discover Your Style!",
    description: "Explore the best trends in fashion.",
    learnMoreUrl: "25%off" // URL for the first slide
  },
  {
    url: imageSrc,
    title: "Discover Your Style!",
    description: "Explore the best trends in fashion.",
    learnMoreUrl: "75%off" // URL for the second slide
  },
  {
    url: imageSrc2,
    title: "Discover Your Style!",
    description: "Explore the best trends in fashion.",
    learnMoreUrl: "50%off" // URL for the third slide
  }
];

function Slideshow() {
  const [currentUrl, setCurrentUrl] = useState(slideImages[0].learnMoreUrl); // Initialize with the URL of the first slide
  
  useEffect(() => {
    AOS.init();
  }, []);

  const handleSlideChange = (index) => {
    // Update the current URL when the slide changes
    setCurrentUrl(slideImages[index].learnMoreUrl);
  };

  return (
    <div className="slideshow-container w-full">
      <Zoom
        onChange={(currentSlide) => handleSlideChange(currentSlide)}
      >
        {slideImages.map((slide, index) => (
          <div key={index} className="relative">
            <div
              style={{
                ...slideImageContainerStyle,
                backgroundImage: `url(${slide.url})`,
              }}
            />
            <div style={slideContentStyle} data-aos="fade-right">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              {/* Displaying the URL for all images */}
              <a href={currentUrl} className="btn btn-primary">Learn More</a>
            </div>
          </div>
        ))}
      </Zoom>
    </div>
  );
}

export default Slideshow;
