import React, { useState, useEffect, useContext } from "react";
import { Container } from "@mui/material";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { StoreContext } from "../store/StoreContext";
import { useNavigate } from "react-router-dom";
import CustomerForm from "./CustomerForm";
import PaymentForm from "./PaymentForm";
import handlePayPalApprove from "./PaymentForm";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { state, createOrder } = useContext(StoreContext);
  const { cartItems } = state.cart;
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    email: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      formData.address &&
      formData.city &&
      formData.postalCode &&
      formData.country &&
      formData.phone &&
      paymentMethod;
    setIsFormValid(isValid);
  }, [formData, paymentMethod]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (!formData.country) {
      errors.country = "Country is required";
    }
    if (!formData.city) {
      errors.city = "City is required";
    }
    if (!formData.address) {
      errors.address = "Address is required";
    }
    if (!formData.postalCode) {
      errors.postalCode = "Postal code is required";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (paymentMethod === "stripe") {
      if (!stripe || !elements) {
        console.log("Stripe or Elements not loaded");
        return;
      }

      const cardElement = elements.getElement(CardElement);

      try {
        setLoading(true);
        const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          console.error("Stripe error: ", error.message);
          setError(error.message);
          setLoading(false);
          return;
        }

        const orderData = {
          orderItems: cartItems,
          shippingAddress: formData,
          paymentMethod: stripePaymentMethod.id,
          paymentResult: {
            id: stripePaymentMethod.id,
            card: stripePaymentMethod.card,
            billing_details: stripePaymentMethod.billing_details,
          },
          itemsPrice: calculateTotal(),
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: calculateTotal(),
        };

        await createOrder(orderData);
        setSuccess(true);
        setError(null);
        setLoading(false);
        navigate("/order-confirmation");
      } catch (error) {
        console.error("Order creation error: ", error.message);
        setError(error.message);
        setLoading(false);
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2);
  };

  return (
    <Container>
      <CustomerForm
        formData={formData}
        formErrors={formErrors}
        handleChange={handleChange}
        cartItems={cartItems}
        calculateTotal={calculateTotal}
      />
      <PaymentForm
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        handleSubmit={handleSubmit}
        isFormValid={isFormValid}
        loading={loading}
        error={error}
        success={success}
        handlePayPalApprove={handlePayPalApprove}
        calculateTotal={calculateTotal}
      />
    </Container>
  );
};

export default CheckoutForm;
