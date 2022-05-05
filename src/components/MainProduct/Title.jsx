import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";

export default function Title( productsList ) {
  const [btnPress, setBtnPress] = useState("");
  const router = useRouter();
  // const numProducts = useStore((state) => state.num);

  const sortAscendingHandler = () => {
    if (router.query.sort === "asc") {
      router.push(`${router.query.productCategory}`);
    } else {
      router.push(`${router.query.productCategory}?sort=asc`);
    }
  };

  const sortDescendingHandler = () => {
    if (router.query.sort === "desc") {
      router.push(`${router.query.productCategory}`);
    } else {
      router.push(`${router.query.productCategory}?sort=desc`);
    }
  };

  useEffect(() => {
    setBtnPress(
      router.query.sort === "asc"
        ? "btn1"
        : router.query.sort === "desc"
        ? "btn2"
        : ""
    );
  }, [setBtnPress, router.query.sort]);

  return (
    <div>
      <div
        className="mt-[30px] font-bold text-5xl mb-6 capitalize
      md:text-4xl
      md:mb-4
      xs:mt-[15px]
      xs:mb-2
      dark:text-white"
      >
        {router.query.productCategory}
        {router.query.productCategory !== "shoes" &&
        router.query.productCategory !== "accessory"
          ? "'s "
          : " "}
        products
      </div>
      <div
        className="text-right text-sm font-semibold uppercase relative
        md:text-xs
        sm:text-right
        xs:text-left
        dark:text-white"
      >
        <p>sorted by:</p>
        <div
          className="absolute top-[-3px] right-[-90px] flex items-center gap-2
        md:right-[-50px]
        sm:right-[-80px]
        xs:right-[180px]
        "
        >
          <button
            onClick={sortAscendingHandler}
            className={`flex-center 
      py-1 px-2 bg-white text-black z-10 transition duration-300 ${
        btnPress === "btn1" && "bg-primary-color"
      }`}
          >
            <FaSortAmountDownAlt
              className="text-lg 
            md:text-sm"
            />
          </button>
          <button
            onClick={sortDescendingHandler}
            className={`flex-center 
      py-1 px-2 bg-white text-black z-10 transition duration-300 ${
        btnPress === "btn2" && "bg-primary-color"
      }`}
          >
            <FaSortAmountDown
              className="text-lg
            md:text-sm"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
