import React from "react";
import { useCart, useCartDispatch } from "../contexts/CartProvider";
import { getImgUrl } from "../common/utils";
import { useNavigate } from "react-router-dom";
import { useWishlist, useWishlistDispatch } from "../contexts/WishlistProvider";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthProvider";
import emptyCart from "../assets/empty-cart.webp";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const totalPrice = (cart) =>
    cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return cart?.length > 0 ? (
    <section className="mx-auto grid w-[90vw] grid-rows-[auto_auto] justify-center gap-8 py-4 md:w-full md:grid-cols-[auto_auto]">
      <section className="flex flex-col gap-4 md:w-[450px]">
        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </section>
      <section className="flex h-[fit-content] w-[300px] flex-col gap-4 rounded-lg bg-white p-4 text-[14px] shadow-sm max-[800px]:w-[90vw] sm:text-sm">
        <h1 className="text-sm uppercase sm:text-lg">Price Details</h1>
        <div className="flex justify-between">
          <p>Price</p>
          <p>₹{totalPrice(cart).toFixed(2)}</p>
        </div>
        {totalPrice(cart) > 100 && (
          <div className="flex justify-between">
            <p>Discount</p>
            <p>- ₹25.00</p>
          </div>
        )}
        <div className="flex justify-between capitalize">
          <p>Delivery charges</p>
          <p>free</p>
        </div>
        <div className="-mt-2 flex w-auto justify-between border-t-[1px] pt-2 md:w-full">
          <p>Total Price</p>
          <p className="font-semibold text-green-700">
            ₹
            {totalPrice(cart) > 100
              ? `${totalPrice(cart).toFixed(2) - 25}`
              : `${totalPrice(cart).toFixed(2)}`}
          </p>
        </div>
        <button
          className="rounded-md border-[1px] p-1 px-2 capitalize"
          onClick={() => navigate("/checkout")}
        >
          Buy now
        </button>
      </section>
    </section>
  ) : (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="mx-auto mb-8 flex w-[90%] flex-col items-center text-center text-sm md:h-full md:text-lg"
    >
      <img src={emptyCart} alt="" className="w-[200px] md:w-[20vw]" />
      <p>
        Well, our cart seems to have taken a break. Time to fill it up with your
        amazing choices!
      </p>
    </motion.section>
  );
}

function CartItem({ item }) {
  const cartDispatch = useCartDispatch();
  const wishlistDispatch = useWishlistDispatch();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { user, isLoggedIn } = useAuth();

  const { id, product_name, brand, price, category, qty } = item;

  const inWishlist = wishlist.find((item) => item.id === id);

  const removeItemFromCart = async () => {
    if (isLoggedIn) {
      try {
        const request = await fetch(`/api/user/cart/${id}`, {
          method: "DELETE",
          headers: {
            authorization: user.token,
          },
        });
        const res = await request.json();
        cartDispatch({ type: "INITIALISE_CART", payload: res.cart });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateQty = async (action) => {
    if (isLoggedIn) {
      try {
        const request = await fetch(`/api/user/cart/${id}`, {
          method: "POST",
          headers: {
            authorization: user.token,
          },
          body: JSON.stringify({ action }),
        });
        const res = await request.json();
        cartDispatch({ type: "INITIALISE_CART", payload: res.cart });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addToWishlist = async (item) => {
    if (isLoggedIn) {
      try {
        const request = await fetch("/api/user/wishlist", {
          method: "POST",
          headers: {
            authorization: user.token,
          },
          body: JSON.stringify({ product: item }),
        });

        const res = await request.json();
        wishlistDispatch({
          type: "INITIALISE_WISHLIST",
          payload: res.wishlist,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const moveToWishlist = () => {
    removeItemFromCart();
    addToWishlist(item);
    toast.success("Moved to Wishlist!");
  };

  return (
    <section
      onClick={() => navigate(`/products/${id}`)}
      className="grid w-full cursor-pointer grid-cols-[150px_1fr] overflow-hidden rounded-lg shadow-sm md:w-[auto]"
    >
      <img
        src={getImgUrl(category.toLowerCase())}
        alt={`${product_name}`}
        className="h-full w-[150px] object-cover"
      />
      <div className="bottom-0 flex w-full flex-col items-start justify-between gap-0 bg-white px-4 py-2">
        <div className="flex flex-col items-start">
          <h3 className="line-clamp-1 font-bold uppercase">{product_name}</h3>
          <p className="text-xs uppercase">{brand}</p>
          <p className="py-1">₹{price}</p>
          <div className="flex gap-4 rounded-sm border-[1px]">
            {item.qty > 1 ? (
              <button
                className="h-6 w-6 border-r-[1px] bg-gray-100 text-xs active:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  updateQty({ type: "decrement" });
                }}
              >
                ▼
              </button>
            ) : (
              <button
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-6 border-r-[1px] bg-gray-100 text-xs text-gray-500 active:bg-gray-200"
              >
                ▼
              </button>
            )}
            <p>{item.qty}</p>
            <button
              className="h-6 w-6 border-l-[1px] bg-gray-100 text-xs active:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                updateQty({ type: "increment" });
              }}
            >
              ▲
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <button
            className="mt-2 rounded-md border-[1px] p-1 px-2 text-xs capitalize active:bg-gray-100 sm:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              removeItemFromCart();
            }}
          >
            Remove From cart
          </button>
          {!inWishlist ? (
            <button
              className="mt-2 rounded-md border-[1px] p-1 px-2 text-xs capitalize active:bg-gray-100 sm:text-sm"
              onClick={(e) => {
                e.stopPropagation();
                moveToWishlist();
              }}
            >
              Move to wishlist
            </button>
          ) : (
            <button
              className="mt-2 rounded-md border-[1px] p-1 px-2 text-sm capitalize opacity-75"
              onClick={(e) => e.stopPropagation()}
            >
              Already in wishlist
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
