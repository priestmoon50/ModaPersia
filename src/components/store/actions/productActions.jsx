import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_ADD_REQUEST,
  PRODUCT_ADD_SUCCESS,
  PRODUCT_ADD_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
} from "../constants/productConstants";
import productService from "../../../services/productService";

// Helper function to create FormData from a product object
const createProductFormData = (product) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", product.price);
  formData.append("discountPercentage", product.discountPercentage || 0);

  // Add sizes, colors, and images to FormData
  if (product.sizes && product.sizes.length > 0) {
    product.sizes.forEach(size => formData.append("sizes[]", size));
  }

  if (product.colors && product.colors.length > 0) {
    product.colors.forEach(color => formData.append("colors[]", color));
  }

  if (product.images && product.images.length > 0) {
    product.images.forEach(image => formData.append("images[]", image));
  }

  return formData;
};

// General action handler to simplify repetitive code
const handleAction = async (dispatch, requestType, successType, failType, action, handleError, customMessage = "") => {
  try {
    dispatch({ type: requestType });
    const data = await action();
    dispatch({ type: successType, payload: data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
    handleError(error, customMessage);
    dispatch({ type: failType, payload: errorMessage });
  }
};

export const fetchProductsAction = async (dispatch, handleError) => {
  await handleAction(
    dispatch,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    async () => {
      const response = await productService.getProducts();
      return response.data;
    },
    handleError,
    "Failed to fetch products"
  );
};

export const addProductAction = async (dispatch, handleError, product) => {
  await handleAction(
    dispatch,
    PRODUCT_ADD_REQUEST,
    PRODUCT_ADD_SUCCESS,
    PRODUCT_ADD_FAIL,
    async () => {
      const formData = createProductFormData(product);
      const addedProduct = await productService.createProduct(formData);
      
      // بازخوانی لیست محصولات پس از افزودن محصول جدید
      await fetchProductsAction(dispatch, handleError);
      
      return addedProduct;
    },
    handleError,
    "Failed to add product"
  );
};

export const updateProductAction = async (dispatch, handleError, id, product) => {
  await handleAction(
    dispatch,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    async () => {
      const formData = createProductFormData(product);
      const updatedProduct = await productService.updateProduct(id, formData);
      
      // بازخوانی لیست محصولات پس از به‌روزرسانی محصول
      await fetchProductsAction(dispatch, handleError);
      
      return updatedProduct;
    },
    handleError,
    "Failed to update product"
  );
};


export const deleteProductAction = async (dispatch, handleError, id, fetchProducts) => {
  await handleAction(
    dispatch,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    async () => {
      await productService.deleteProduct(id);
      fetchProducts();
      return id;
    },
    handleError,
    "Failed to delete product"
  );
};
