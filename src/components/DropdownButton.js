import React, { useState } from 'react';
import { FaCopy, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './DropdownButton.css'; // Include your own styles or use inline styles

const DropdownButton = ({ link, details, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copy status after 2 seconds
  };

  return (
    <div className="dropdown-button">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-link flex-wrap text-wrap text-justify">
          <span>{name}</span> 
            <button className="copy-button" onClick={handleCopy}>
              <FaCopy />
            </button>
            {copied && <span className="copy-feedback">Copied!</span>}
          </div>
          {details && (
            <div className="dropdown-details">
              <p>{details}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
