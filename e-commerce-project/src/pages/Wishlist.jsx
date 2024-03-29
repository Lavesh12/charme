import React from "react";
import { useWishlist } from "../contexts/WishlistProvider";
import Product from "../components/Product";
import heartImg from "../assets/heart.webp";
import { motion } from "framer-motion";

export default function Wishlist() {
  const { wishlist } = useWishlist();
  return (
    <section className="mx-auto mb-8 h-full w-[90vw]">
      {wishlist.length > 0 ? (
        <section className="flex w-full flex-wrap justify-center gap-8 max-[500px]:gap-[5px]">
          {wishlist.map((item) => (
            <Product key={item.id} item={item} />
          ))}
        </section>
      ) : (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mx-auto flex max-w-[500px] flex-col items-center text-center text-sm md:h-full md:text-lg"
        >
          <img src={heartImg} alt="" className="w-[200px] md:w-[20vw]" />
          <p>
            Empty wishlist, full imagination! Let's sprinkle it with stardust
            and watch it blossom into a garden of desires. Start dreaming, and
            let's make it happen!
          </p>
        </motion.section>
      )}
    </section>
  );
}
