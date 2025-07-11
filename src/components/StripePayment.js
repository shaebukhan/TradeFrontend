import React, { useState, useEffect } from 'react';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Load your publishable key from Stripe
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY); // Replace with your Stripe publishable key

const StripePayment = ({ jobData, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    // Fetch the clientSecret from your backend
    useEffect(() => {
        axios.post(`${process.env.REACT_APP_API}/api/v1/payment/create-payment-intent`, {
            amount: 1000, // Replace with the actual amount
        })
            .then((response) => {
                setClientSecret(response.data.clientSecret);
            })
            .catch((error) => {
                console.error("Error fetching clientSecret:", error);
                toast.error("Failed to initialize payment");
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setLoading(true);
        try {
            // Confirm the payment with Stripe
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/success`, // Redirect URL after successful payment
                },
            });

            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            // If the payment is successful, post the job data to your backend
            const response = await axios.post(`${process.env.REACT_APP_API}/api/v1/jobs/post-job`, {
                ...jobData,
                paymentStatus: 'succeeded', // Track payment status
            });

            if (response.data.success) {
                toast.success("Job posted successfully!");
                onSuccess(); // Callback function to handle UI update
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    if (!clientSecret) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement className="card-input" />
            <button type="submit" className="pay-btn" disabled={loading || !stripe}>
                {loading ? "Processing..." : "Pay & Post Job"}
            </button>
        </form>
    );
};

// Wrap your StripePayment component with the Elements provider
const StripePaymentWrapper = ({ jobData, onSuccess }) => (
    <Elements stripe={stripePromise} options={process.env.STRIPE_PUBLIC_KEY}>
        <StripePayment jobData={jobData} onSuccess={onSuccess} />
    </Elements>
);

export default StripePaymentWrapper;