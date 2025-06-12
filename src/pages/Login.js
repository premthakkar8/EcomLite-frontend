import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

// Components
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  // Check if user is already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/login`,
        { email, password }
      );
      
      // Save user info and token to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('userToken', data.token);
      
      setLoading(false);
      toast.success('Login successful!');
      
      // Redirect
      navigate(redirect);
      
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Invalid email or password'
      );
    }
  };
  
  return (
    <FormContainer>
      <h1>Sign In</h1>
      
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-3' disabled={loading}>
          {loading ? <Loader /> : 'Sign In'}
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
      
      {/* Demo Credentials */}
      <div className='mt-4 p-3 border rounded bg-light'>
        <h5>Demo Credentials</h5>
        <p><strong>Admin:</strong> admin@ecomlite.com / admin123</p>
        <p><strong>User:</strong> user@example.com / user123</p>
      </div>
    </FormContainer>
  );
};

export default Login;