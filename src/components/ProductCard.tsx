import React from "react";
import Image from "./Image";
import Button from "./ui/Button";
import type { IProduct } from "../interfaces";
import { txtSlicer } from "../utils/functions";
import CircleColor from "./ui/CircleColor";

interface IProps {
  product: IProduct;
  setProductToEdit: (product: IProduct) => void;
  openEditModal: () => void;
  idx: number;
  setProductToEditIdx: (value: number) => void;
}

const ProductCard = ({
  product, 
  setProductToEdit,
  openEditModal,
  setProductToEditIdx,
  idx,
}: IProps) => {
  const { title, description, imageURL, price, colors, category } = product;
  const renderColors = colors.map((color) => (
    <CircleColor key={color} color={color} />
  ));

 const onEdit = () => {
   setProductToEdit(product);
   setProductToEditIdx(idx);
   openEditModal();
 };

  return (
    <div className="max-w-sm md:max-w-lg mx-auto md:mx-0 border rounded-md p-2 flex flex-col space-y-3">
      <Image
        src={imageURL}
        alt={title}
        className="w-full h-auto mb-2 object-center"
      />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 mt-4">{txtSlicer(description, 120)}</p>
      <div className="flex items-center my-4 space-x-2">{renderColors}</div>

      <div className="flex items-center justify-between mb-4">
        <span>${price}</span>

        <Image
          src={category.imageURL}
          alt={category.name}
          className="w-10 h-10 rounded-full  object-center"
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Button className="h-10 bg-teal-700" onClick={onEdit}>
          Edit
        </Button>
        <Button className="h-10 bg-red-800 ">Delete</Button>
      </div>
    </div>
  );
};

export default ProductCard;
