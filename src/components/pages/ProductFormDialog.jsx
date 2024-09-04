import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const ProductFormDialog = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
  loadingSave,
}) => {
  const { handleSubmit, control } = useForm({
    defaultValues,
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {defaultValues._id ? "Edit Product" : "Add Product"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Name" fullWidth margin="dense" />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="dense"
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                margin="dense"
              />
            )}
          />
          <Controller
            name="discountPercentage"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Discount Percentage"
                type="number"
                fullWidth
                margin="dense"
              />
            )}
          />
          <Controller
            name="sizes"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>Sizes</InputLabel>
                <Select {...field} multiple label="Sizes">
                  <MenuItem value="XS">XS</MenuItem>
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="M">M</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="XL">XL</MenuItem>
                  <MenuItem value="XXL">XXL</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="colors"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="dense">
                <InputLabel>Colors</InputLabel>
                <Select {...field} multiple label="Colors">
                  <MenuItem value="Red">Red</MenuItem>
                  <MenuItem value="Blue">Blue</MenuItem>
                  <MenuItem value="Green">Green</MenuItem>
                  <MenuItem value="Yellow">Yellow</MenuItem>
                  <MenuItem value="Black">Black</MenuItem>
                  <MenuItem value="White">White</MenuItem>
                  <MenuItem value="Purple">Purple</MenuItem>
                  <MenuItem value="Orange">Orange</MenuItem>
                  <MenuItem value="Pink">Pink</MenuItem>
                  <MenuItem value="Brown">Brown</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="file"
                inputProps={{ multiple: true }}
                fullWidth
                margin="dense"
              />
            )}
          />

          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={loadingSave}>
              {loadingSave ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
 
export default ProductFormDialog;
