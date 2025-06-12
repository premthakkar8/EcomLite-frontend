import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

// Components
import Loader from '../components/Loader';
import Message from '../components/Message';

const Checkout = () => {
  const navigate = useNavigate();
  
  // States
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('PayU');
  const [paymentLink, setPaymentLink] = useState('');
  
  // Get cart items and shipping address from localStorage
  useEffect(() => {
    const items = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    
    const address = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {};
    
    setCartItems(items);
    setShippingAddress(address);
    
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart');
    }

    // Get PayU payment link
    const getPaymentLink = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (token) {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/payment/link`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPaymentLink(data.paymentLink);
        }
      } catch (error) {
        console.error('Error fetching payment link:', error);
      }
    };

    getPaymentLink();
  }, [navigate]);
  
  // Calculate prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );
  
  // Handle order creation
  const createOrder = async () => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        toast.error('Please login to place an order');
        navigate('/login');
        return;
      }
      
      setLoading(true);
      
      // Create order in database
      const { data: order } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders`,
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Store order ID in localStorage for reference after payment
      localStorage.setItem('currentOrderId', order._id);
      
      // Redirect to PayU payment link
      window.location.href = paymentLink;
      
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Something went wrong');
      console.error(error);
    }
  };
  
  return (
    <>
      <h1>Checkout</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <Form.Group>
                <Form.Check
                  type='radio'
                  label='PayU'
                  id='PayU'
                  name='paymentMethod'
                  value='PayU'
                  checked
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></Form.Check>
              </Form.Group>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <span>{item.name}</span>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block w-100'
                  disabled={cartItems.length === 0 || loading || !paymentLink}
                  onClick={createOrder}
                >
                  {loading ? <Loader /> : 'Place Order'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Checkout;