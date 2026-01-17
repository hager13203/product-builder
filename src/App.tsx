import { useState, type ChangeEvent, type FormEvent } from "react";
import "./App.css";
import Modal from "./components/Modal";
import ProductCard from "./components/ProductCard";
import { colors, formInputsList, productList } from "./data";
import Button from "./components/ui/Button";
import type { IProduct } from "./interfaces";
import { validateProduct } from "./validation";
import ErrorMsg from "./components/ErrorMsg.tsx";
import CircleColor from "./components/ui/CircleColor.tsx";

function App() {
  const defaultProductObj = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: [],
    category: {
      name: "",
      imageURL: "",
    },
  };
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    imageURL: "",
    price: "",
  });
  const [product, setProduct] = useState<IProduct>(defaultProductObj);
  const [tempColors, setTempColors] = useState<string[]>([]);
  console.log(tempColors);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const handleCancel = () => {
    setProduct(defaultProductObj);
    close();
  };
  function HandleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  }

  const HandleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { title, description, imageURL, price } = product;
    console.log("Submitted product:", product);
    const errors = validateProduct({
      title,
      description,
      imageURL,
      price,
    });

    const hasErrors = Object.values(errors).some((value) => value !== "");
    if (hasErrors) {
      setErrors(errors);
      return;
    }
  };

  /* -------------------- RENDER -------------------- */

  const renderProductCards = productList.map((product) => (
    <ProductCard key={product.id} product={product} />
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

  const renderColors = colors.map((color) => (
    <CircleColor
      key={color}
      color={color}
      onClick={() => {
        if (tempColors.includes(color)) {
          setTempColors((prev) => prev.filter((item) => item !== color));
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

        <Modal isOpen={isOpen} closeModal={close} title="ADD NEW PRODUCT">
          <form onSubmit={HandleSubmit} className="flex flex-col space-y-4">
            {renderFormInputs}
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
            </div>
            <div className="flex items-center space-x-2">{renderColors}</div>

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
      </main>
    </>
  );
}

export default App;
