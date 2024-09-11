import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Box,
} from "@mui/material";
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
      if (data.discountPercentage) {
        formData.append("discountPercentage", data.discountPercentage);
      }

      // تبدیل آرایه‌ها به رشته‌های JSON
      formData.append("sizes", JSON.stringify(data.sizes));
      formData.append("colors", JSON.stringify(data.colors));

      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => formData.append("images", file));
      }

      // استفاده از سرویس برای ارسال درخواست ایجاد محصول
      const response = await productService.createProduct(formData, userToken);
      console.log("Product created successfully", response.data);
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Price"
            variant="outlined"
            type="number"
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Discount Percentage"
            variant="outlined"
            type="number"
            {...register("discountPercentage")}
            error={!!errors.discountPercentage}
            helperText={errors.discountPercentage?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" error={!!errors.sizes}>
            <InputLabel>Sizes</InputLabel>
            <Controller
              name="sizes"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  multiple
                  value={field.value}
                  onChange={field.onChange}
                  label="Sizes"
                  renderValue={(selected) => selected.join(", ")}
                >
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.sizes?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" error={!!errors.colors}>
            <InputLabel>Colors</InputLabel>
            <Controller
              name="colors"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  multiple
                  value={field.value}
                  onChange={field.onChange}
                  label="Colors"
                  renderValue={(selected) => selected.join(", ")}
                >
                  {[
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
                  ].map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.colors?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.images}>
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  type="file"
                  inputProps={{ multiple: true }}
                  onChange={(e) => field.onChange(e.target.files)}
                />
              )}
            />
            <FormHelperText>{errors.images?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" type="submit">
            Create Product
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateProductForm;
