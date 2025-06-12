import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>EcomLite</h5>
            <p>A lightweight e-commerce platform built with modern web technologies.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light">Home</Link></li>
              <li><Link to="/cart" className="text-light">Cart</Link></li>
              <li><Link to="/login" className="text-light">Login</Link></li>
              <li><Link to="/register" className="text-light">Register</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact</h5>
            <p>Email: support@ecomlite.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="text-center">
          <p>Built by <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-light">Your Name</a> | 
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-light">GitHub</a> | 
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-light">LinkedIn</a></p>
          <p>&copy; {new Date().getFullYear()} EcomLite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;