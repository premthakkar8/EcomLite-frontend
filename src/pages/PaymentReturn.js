import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentReturn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        // Get query parameters from URL
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get('status') || 'failed';
        const paymentId = queryParams.get('paymentId') || 'unknown';
        
        // Get order ID from localStorage
        const orderId = localStorage.getItem('currentOrderId');
        
        if (!orderId) {
          setStatus('error');
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('userToken');
        
        if (!token) {
          setStatus('error');
          setLoading(false);
          return;
        }

        // Update order payment status
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/payment/update-status`,
          {
            orderId,
            paymentId,
            status: paymentStatus === 'success' ? 'success' : 'failed',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Clear cart if payment was successful
        if (paymentStatus === 'success') {
          localStorage.removeItem('cartItems');
          toast.success('Payment successful!');
        } else {
          toast.error('Payment failed');
        }

        // Remove current order ID from localStorage
        localStorage.removeItem('currentOrderId');
        
        setStatus(paymentStatus);
        setLoading(false);
      } catch (error) {
        console.error('Error updating payment status:', error);
        setStatus('error');
        setLoading(false);
      }
    };

    updatePaymentStatus();
  }, [location.search, navigate]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p className="mt-3">Processing your payment...</p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <Alert variant="success">
          <Alert.Heading>Payment Successful!</Alert.Heading>
          <p>
            Your payment has been processed successfully. Thank you for your purchase!
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-success" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
          </div>
        </Alert>
      );
    }

    return (
      <Alert variant="danger">
        <Alert.Heading>Payment Failed</Alert.Heading>
        <p>
          We couldn't process your payment. Please try again or contact customer support.
        </p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="outline-danger" onClick={() => navigate('/checkout')}>
            Try Again
          </Button>
        </div>
      </Alert>
    );
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Payment Status</h1>
      {renderContent()}
    </Container>
  );
};

export default PaymentReturn;