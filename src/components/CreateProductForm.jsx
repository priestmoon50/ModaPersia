import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import productService from "../services/productService"; // ایمپورت سرویس

const CreateProductForm = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Product name is required")
      .max(100, "Product name cannot exceed 100 characters"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price cannot be less than 0"),
    discountPercentage: Yup.number()
      .min(0, "Discount percentage cannot be less than 0")
      .max(100, "Discount percentage cannot exceed 100")
      .optional(),
    sizes: Yup.array()
      .of(Yup.string().oneOf(["XS", "S", "M", "L", "XL", "XXL"]))
      .required("At least one size is required"),
    colors: Yup.array()
      .of(
        Yup.string().oneOf([
          "Red",
          "Blue",
          "Green",
          "Yellow",
          "Black",
          "White",
          "Purple",
          "Orange",
          "Pink",
          "Brown",
        ])
      )
      .required("At least one color is required"),
    images: Yup.mixed().required("Images are required"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const userToken = localStorage.getItem("userToken");

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discountPercentage", data.discountPercentage);
  
      // تبدیل آرایه‌ها به رشته‌های JSON
      formData.append("sizes", JSON.stringify(data.sizes));
      formData.append("colors", JSON.stringify(data.colors));
  
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach(file => formData.append("images", file));
      }
  
      // استفاده از سرویس برای ارسال درخواست ایجاد محصول
      const response = await productService.createProduct(formData, userToken);
      console.log('Product created successfully', response.data);
    } catch (error) {
      console.error('Error creating product', error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Product Name</label>
        <input type="text" {...register("name")} />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <label>Description</label>
        <textarea {...register("description")} />
        {errors.description && <p>{errors.description.message}</p>}
      </div>

      <div>
        <label>Price</label>
        <input type="number" {...register("price")} />
        {errors.price && <p>{errors.price.message}</p>}
      </div>

      <div>
        <label>Discount Percentage</label>
        <input type="number" {...register("discountPercentage")} />
        {errors.discountPercentage && (
          <p>{errors.discountPercentage.message}</p>
        )}
      </div>

      <div>
        <label>Sizes</label>
        <select multiple {...register("sizes")}>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
        {errors.sizes && <p>{errors.sizes.message}</p>}
      </div>

      <div>
        <label>Colors</label>
        <select multiple {...register("colors")}>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
          <option value="Green">Green</option>
          <option value="Yellow">Yellow</option>
          <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Purple">Purple</option>
          <option value="Orange">Orange</option>
          <option value="Pink">Pink</option>
          <option value="Brown">Brown</option>
        </select>
        {errors.colors && <p>{errors.colors.message}</p>}
      </div>

      <div>
        <label>Images</label>
        <Controller
          control={control}
          name="images"
          render={({ field }) => (
            <input
              type="file"
              multiple
              onChange={(e) => field.onChange(e.target.files)}
            />
          )}
        />
        {errors.images && <p>{errors.images.message}</p>}
      </div>

      <button type="submit">Create Product</button>
    </form>
  );
};

export default CreateProductForm;
