import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../services/productService";
import { useContext } from "react";
import { AdminContext } from "../store/AdminContext";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: adminState } = useContext(AdminContext);
  const { token } = adminState; // فرض اینکه توکن در AdminContext ذخیره شده است

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required").max(100),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required").min(0),
    discountPercentage: Yup.number().min(0).max(100).optional(),
    sizes: Yup.array()
      .of(Yup.string().oneOf(["XS", "S", "M", "L", "XL", "XXL"]))
      .required("At least one size is required"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data); // ذخیره داده‌های محصول در state
        setLoading(false);

        // پر کردن فیلدهای فرم با داده‌های محصول
        setValue("name", response.data.name);
        setValue("description", response.data.description);
        setValue("price", response.data.price);
        setValue("discountPercentage", response.data.discountPercentage);
        setValue("sizes", response.data.sizes);
      } catch (error) {
        setError("Failed to load product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        discountPercentage: data.discountPercentage || 0,
        sizes: data.sizes, // ارسال به صورت آرایه
      };

      await productService.updateProduct(id, payload, token);
      navigate("/admin/products");
    } catch (error) {
      setError("Failed to update product");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h5">{error}</Typography>;
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 600, mx: "auto", p: 2 }}
    >
      <Typography variant="h4" mb={2}>
        Editing: {product.name} {/* نمایش نام محصول */}
      </Typography>
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
          <Button fullWidth variant="contained" color="primary" type="submit">
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EditProduct;
