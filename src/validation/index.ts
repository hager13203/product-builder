export const validateProduct = (product: {
  title: string;
  description: string;
  imageURL: string;
  price: string;
  colors: string[];
}) => {
  const errors = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: "",
  };

  // ** TITLE Validation
  if (
    !product.title.trim() ||
    product.title.length < 10 ||
    product.title.length > 80
  ) {
    errors.title = "Title must be between 10 and 80 characters";
  }

  // ** DESCRIPTION Validation
  if (
    !product.description.trim() ||
    product.description.length < 10 ||
    product.description.length > 900
  ) {
    errors.description = "Description must be between 10 and 900 characters";
  }

  // ** IMAGE URL Validation
const urlRegex =
  /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

  if (!product.imageURL.trim() || !urlRegex.test(product.imageURL)) {
    errors.imageURL = "Please enter a valid image URL";
  }

  // ** PRICE Validation
  const priceNumber = Number(product.price);

  if (!product.price.trim() || isNaN(priceNumber) || priceNumber <= 0) {
    errors.price = "Price must be a positive number";
  }

  // ** COLORS Validation

  if (!product.colors || product.colors.length === 0) {
    errors.colors = "Please choose at least one color";
  }

  return errors;
};
