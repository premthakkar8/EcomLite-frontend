import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

// Components
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded product-card">
      <Link to={`/product/${product._id}`}>
        <Card.Img 
          src={product.image} 
          variant="top" 
          className="product-image"
          alt={product.name} 
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} className="product-title-link">
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as="h3" className="product-price">
          ₹{product.price.toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;