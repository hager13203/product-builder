import { useState, type ChangeEvent, type FormEvent } from "react";
import "./App.css";
import Modal from "./components/Modal";
import ProductCard from "./components/ProductCard";
import { categories, colors, formInputsList, productList } from "./data";
import Button from "./components/ui/Button";
import type { IProduct } from "./interfaces";
import { validateProduct } from "./validation";
import ErrorMsg from "./components/ErrorMsg.tsx";
import CircleColor from "./components/ui/CircleColor.tsx";
import { v4 as uuid } from "uuid";
import Select from "./components/ui/Select.tsx";
import type { ProductNameTypes } from "./types/index.ts";

function App() {
  const defaultProductObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: [],
    category: {
      id: "",
      name: "",
      imageURL: "",
    },
  };
  // ------------------- STATE -------------------
  const [isOpen, setIsOpen] = useState(false);
  const [isOpeEditModal, SetOpenEditModal] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: "",
  });
  const [products, setProducts] = useState<IProduct[]>(productList);
  const [product, setProduct] = useState<IProduct>(defaultProductObj);
  const [productToEdit, setproductToEdit] =
    useState<IProduct>(defaultProductObj);
  const [productToEditIDX, setproductToEditIDX] =
    useState<number>(0);
  const [tempColors, setTempColors] = useState<string[]>([]);
  console.log(tempColors);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // ---------------------- HANDLER ----------------------
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const openEditModal = () => SetOpenEditModal(true);
  const closeEditModal = () => SetOpenEditModal(false);

  const handleCancel = () => {
    setProduct(defaultProductObj);
    close();
  };

  const HandleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const HandleEditInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setproductToEdit(() => ({
      ...productToEdit,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const HandleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, description, imageURL, price } = product;
    console.log("Submitted product:", product);
    const errors = validateProduct({
      title,
      description,
      imageURL,
      price,
      colors: tempColors,
    });

    const hasErrors = Object.values(errors).some((value) => value !== "");
    if (hasErrors) {
      setErrors(errors);
      return;
    }
    setProducts((prev) => [
      ...prev,
      {
        ...product,
        id: uuid(),
        colors: tempColors,
        category: selectedCategory,
      },
    ]);
    console.log(product);
    setProduct(defaultProductObj);
    setTempColors([]);
    close();
  };


const HandleSubmitEdit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const { title, description, imageURL, price } = productToEdit;

  const errors = validateProduct({
    title,
    description,
    imageURL,
    price,
    colors: [...productToEdit.colors, ...tempColors],
  });

  const hasErrors = Object.values(errors).some(value => value !== "");
  if (hasErrors) {
    setErrors(errors);
    return;
  }

  const updatedProducts = [...products];

  updatedProducts[productToEditIDX] = {
    ...productToEdit,
    colors: Array.from(
      new Set([...productToEdit.colors, ...tempColors])
    ),
  };

  setProducts(updatedProducts);
  setproductToEdit(defaultProductObj);
  setTempColors([]);
  closeEditModal();
};

  /* -------------------- RENDER -------------------- */

  const renderProductCards = products.map((product, idx) => (
    <ProductCard
      key={product.id}
      product={product}
      setProductToEdit={setproductToEdit}
      openEditModal={openEditModal}
      setProductToEditIdx={setproductToEditIDX}
      idx={idx}
    />
  ));

  const renderFormInputs = formInputsList.map((input) => (
    <div key={input.id} className="flex flex-col gap-1">
      <label htmlFor={input.name} className="text-sm font-medium text-gray-700">
        {input.label}
      </label>

      <input
        type="text"
        name={input.name}
        value={product[input.name]}
        onChange={HandleInputChange}
        className="
        w-full
        rounded-md
        border
        border-gray-300
        px-3
        py-2
        text-sm
        outline-none
        transition
        focus:border-blue-500
        focus:ring-1
        focus:ring-blue-500
      "
      />
      <ErrorMsg msg={errors[input.name]} />
    </div>
  ));
  const renderProductEditWithErrorMsg = (
    id: string,
    name: ProductNameTypes,
    label: string,
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        id={id}
        name={name}
        value={productToEdit[name]}
        onChange={HandleEditInputChange}
        className="
        w-full
        rounded-md
        border
        border-gray-300
        px-3
        py-2
        text-sm
        outline-none
        transition
        focus:border-blue-500
        focus:ring-1
        focus:ring-blue-500
      "
      />
      <ErrorMsg msg={errors[name]} />
    </div>
  );

  const renderColors = colors.map((color) => (
    <CircleColor
      key={color}
      color={color}
      onClick={() => {
        setErrors((prev) => ({ ...prev, colors: "" }));

        // remove from tempColors if exists
      if (tempColors.includes(color)) {
        setTempColors(prev => prev.filter(item => item !== color));
        return;
      }

      // prevent duplicate with existing colors
      if (productToEdit.colors.includes(color)) {
        setproductToEdit((prev) => ({
          ...prev,
          colors: prev.colors.filter((c) => c !== color),
        }));
        return;
      }

     
        setTempColors((prev) => [...prev, color]);
      }}
    />
  ));

  return (
    <>
      <main className="container mx-auto my-8">
        <Button
          onClick={open}
          className="text-white bg-blue-900 p-2 rounded-md"
        >
          ADD
        </Button>
        <div className="m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 rounded-md">
          {renderProductCards}
        </div>
        {/* Add Product Modal */}
        <Modal isOpen={isOpen} closeModal={close} title="ADD NEW PRODUCT">
          <form onSubmit={HandleSubmit} className="flex flex-col space-y-4">
            {renderFormInputs}
            <Select
              selected={selectedCategory}
              setSelected={setSelectedCategory}
            />
            <div className="flex flex-wrap items-center space-x-2">
              {renderColors}
            </div>
            <div className="flex flex-wrap items-center space-x-2 ">
              {tempColors.map((color) => (
                <span
                  key={color}
                  className="text-white text-xs mr-1 mb-2 p-1 rounded-md"
                  style={{ backgroundColor: color }}
                >
                  {color}
                </span>
              ))}
              <ErrorMsg msg={errors.colors} />
            </div>

            <div className="flex items-center space-x-4">
              <Button className="text-white bg-blue-900 p-2 rounded-md">
                Submit
              </Button>
              <Button
                onClick={handleCancel}
                className="text-white bg-gray-500 p-2 rounded-md"
              >
                cancel
              </Button>
            </div>
          </form>
        </Modal>
        {/* Edit Product Modal */}
        <Modal
          isOpen={isOpeEditModal}
          closeModal={closeEditModal}
          title="EDIT THIS PRODUCT"
        >
          <form onSubmit={HandleSubmitEdit} className="flex flex-col space-y-4">
            {renderProductEditWithErrorMsg("title", "title", "Product Name")}
            {renderProductEditWithErrorMsg(
              "description",
              "description",
              "Product Description",
            )}
            {renderProductEditWithErrorMsg(
              "imageURL",
              "imageURL",
              "Product Image URL",
            )}
            {renderProductEditWithErrorMsg("price", "price", "Product Price")}

            {/* <Select
              selected={productToEdit.category || categories[0]}
              setSelected={(value) =>
                setproductToEdit({ ...productToEdit, category: value })
              }
            /> */}

            <div className="flex flex-wrap items-center space-x-2">
              {renderColors}
            </div>

            <div className="flex flex-wrap items-center space-x-2 ">
              {tempColors.concat(productToEdit.colors).map((color) => (
                <span
                  key={color}
                  className="text-white text-xs mr-1 mb-2 p-1 rounded-md"
                  style={{ backgroundColor: color }}
                >
                  {color}
                </span>
              ))}
              <ErrorMsg msg={errors.colors} />
            </div>
            <div className="flex items-center space-x-4">
              <Button className="text-white bg-blue-900 p-2 rounded-md">
                Submit
              </Button>
              <Button
                onClick={closeEditModal}
                className="text-white bg-gray-500 p-2 rounded-md"
              >
                cancel
              </Button>
            </div>
          </form>
        </Modal>
      </main>
    </>
  );
}

export default App;
