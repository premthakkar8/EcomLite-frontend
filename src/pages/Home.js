import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

// Components
import Product from '../components/Product';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import SearchBox from '../components/SearchBox';
import Meta from '../components/Meta';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  // Get URL search params
  const urlParams = new URLSearchParams(window.location.search);
  const keyword = urlParams.get('keyword') || '';
  const pageNumber = urlParams.get('page') || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
        );
        
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
        toast.error('Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, pageNumber]);

  return (
    <>
      <Meta title="Welcome to EcomLite | Home" />
      
      <h1>Latest Products</h1>
      
      <SearchBox />
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate 
            pages={pages} 
            page={page} 
            keyword={keyword ? keyword : ''} 
          />
        </>
      )}
    </>
  );
};

export default Home;