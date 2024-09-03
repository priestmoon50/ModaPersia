import React, {
  createContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
} from "react";
import { productReducer, productInitialState } from "./reducers/productReducer";
import {
  fetchProductsAction,
  addProductAction,
  updateProductAction,
  deleteProductAction,
} from "./actions/productActions";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, productInitialState);
  const [error, setError] = useState(null);

  const handleError = useCallback((error, customMessage = "") => {
    console.error(`${customMessage} Error:`, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unknown error occurred";
    setError(errorMessage);
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      await fetchProductsAction(dispatch, handleError);
    } catch (err) {
      handleError(err, "Fetching products failed.");
    }
  }, [dispatch, handleError]);

  const addProduct = useCallback(
    async (product) => {
      try {
        await addProductAction(dispatch, handleError, product, fetchProducts);
      } catch (err) {
        handleError(err, "Adding product failed.");
      }
    },
    [dispatch, handleError, fetchProducts]
  );

  const updateProduct = useCallback(
    async (id, product) => {
      try {
        console.log("Updating product:", { id, product });
        await updateProductAction(
          dispatch,
          handleError,
          id,
          product,
          fetchProducts
        );
      } catch (err) {
        handleError(err, "Updating product failed.");
      }
    },
    [dispatch, handleError, fetchProducts]
  );

  const deleteProduct = useCallback(
    async (id) => {
      try {
        console.log("Deleting product with id:", id);
        await deleteProductAction(dispatch, handleError, id, fetchProducts);
      } catch (err) {
        handleError(err, "Deleting product failed.");
      }
    },
    [dispatch, handleError, fetchProducts]
  );

  useEffect(() => {
    console.log("Products in state:", state.productList.products);
  }, [state.productList.products]);

  return (
    <ProductContext.Provider
      value={{
        state,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
