import Image from "next/image";
import { useState } from "react";
import DeliveryModal from "@/app/model/DeliveryModal";

interface CoffeeCardProps {
  name: string;
  price: string;
  imageUrl: string;
  bgColor: string;
  onClick?: () => void;
  actionLabel?: string;
  onAction?: (quantity: number) => void;
}

export function CoffeeCard({
  name,
  price,
  imageUrl,
  bgColor,
  onClick,
  actionLabel = "Get Delivery",
  onAction,
}: CoffeeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  function handleAction() {
    if (onAction) {
      onAction(quantity);
      return;
    }
    openModal();
  }

  return (
    <div
      className={`rounded-2xl p-6 text-center shadow-lg ${bgColor} text-white ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
    >
      <Image
        src={imageUrl}
        alt={name}
        width={500}
        height={500}
        className="mx-auto mb-4 h-40 object-contain"
      />
      <h2 className="text-xl font-bold">Rs {price}</h2>
      <h3 className="text-2xl font-semibold">{name}</h3>
      <p className="text-sm opacity-80 mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus.
      </p>
      <div className="mt-4 flex justify-center items-center space-x-2">
        <label htmlFor={`quantity-${name}`} className="text-sm">
          Qty:
        </label>
        <input
          id={`quantity-${name}`}
          type="number"
          min="1"
          value={quantity}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          className="w-16 p-1 text-white rounded border"
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAction();
        }}
        className="cursor-pointer mt-4 w-full rounded-lg bg-white py-2 text-black font-semibold hover:bg-gray-200"
      >
        {actionLabel}
      </button>

      {!onAction && isModalOpen && (
        <DeliveryModal handleClose={closeModal} product={{ name, price, quantity }} />
      )}
    </div>
  );
}