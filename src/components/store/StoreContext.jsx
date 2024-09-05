// StoreContext.jsx
import React, { createContext, useReducer, useCallback, useState } from "react";
import axios from "axios";
import { storeReducer, initialState } from "./reducers/storeReducer";
import { createOrder, fetchOrderDetails, updateOrderToDeliveredAction } from "./actions/orderActions";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const [error, setError] = useState(null);

  const handleError = useCallback((error, customMessage = "") => {
    console.error(`${customMessage} Error:`, error);
    const errorMessage = error.response?.data?.message || error.message;
    setError(errorMessage);
  }, []);

  const listAllOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/orders");
      dispatch({ type: "ORDER_LIST_SUCCESS", payload: data });
    } catch (error) {
      handleError(error, "Failed to list orders");
    }
  }, [dispatch, handleError]);

  const createNewOrder = useCallback(
    async (orderData) => {
      try {
        await createOrder(orderData, dispatch);
      } catch (error) {
        handleError(error, "Failed to create order");
      }
    },
    [dispatch, handleError]
  );

  const fetchOrderDetailsAction = useCallback(
    async (id) => {
      try {
        await fetchOrderDetails(id, dispatch);
      } catch (error) {
        handleError(error, "Failed to fetch order details");
      }
    },
    [dispatch, handleError]
  );

  const updateOrderToDelivered = useCallback(
    async (id) => {
      try {
        await updateOrderToDeliveredAction(id, dispatch);
      } catch (error) {
        handleError(error, "Failed to update order to delivered");
      }
    },
    [dispatch, handleError]
  );

  return (
    <StoreContext.Provider
      value={{
        state,
        listAllOrders,
        createNewOrder,
        fetchOrderDetails: fetchOrderDetailsAction,
        updateOrderToDelivered,
        error,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
