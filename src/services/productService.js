import axios from 'axios';

const API_URL = '/api/products';

const productService = {
  // تابع برای ایجاد محصول جدید
  createProduct: (formData, token) => {
    return axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // تابع برای دریافت لیست محصولات
  getProducts: () => {
    return axios.get(API_URL);
  },

  // تابع برای دریافت یک محصول خاص با استفاده از ID
  getProductById: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },

  // تابع برای به‌روزرسانی محصول
  updateProduct: (id, formData, token) => {
    return axios.put(`${API_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // تابع برای حذف محصول
  deleteProduct: (id, token) => {
    return axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// اختصاص شیء به یک متغیر و سپس صادر کردن آن به عنوان default export
export default productService;
