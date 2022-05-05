import AccordionsGeneral from "./AccordionsGeneral";
import classes from "styles/PriceRange.module.css";
import { useEffect, useRef, useState } from "react";

const GAP = 500;
export const MAX_PRICE = "4000";
export default function PriceRange() {
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  return (
    <AccordionsGeneral heading="Price">
      <div className="px-6 py-3 pb-5 mb-5 shadow-sm">
        <div
          className="flex items-center flex-between mb-8
        "
        >
          <div
            className="flex items-center gap-2
          lg:gap-1"
          >
            <span className="text-sm">From</span>
            <div
              className=" text-center select-none font-semibold text-lg max-w-[66px]
            lg:text-sm"
            >
              {`$${minInput}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">To</span>

            <div
              className="text-center select-none font-semibold text-lg max-w-[66px]
            lg:text-sm"
            >
              {`$${maxInput}`}
            </div>
          </div>
        </div>
        <div className="h-[5px] bg-[#ddd] rounded-md relative">
          <div
            className={`h-[5px] absolute bg-primary-color rounded-md`}
            ref={progressRef}
          ></div>
        </div>
        <div className="relative">
          <input
            className={`absolute top-[-5px] h-[5px] appearance-none [background:none] w-full pointer-events-none ${classes.sliderThumb}`}
            type="range"
            min="0"
            max={MAX_PRICE}
            step="100"
            name="min-range"
            // onChange={handleChangeSlider}
            value={minInput}
          />
          <input
            className={`absolute top-[-5px] h-[5px] appearance-none [background:none] w-full  pointer-events-none ${classes.sliderThumb}`}
            type="range"
            min="0"
            max={MAX_PRICE}
            step="100"
            name="max-range"
            // onChange={handleChangeSlider}
            value={maxInput}
          />
        </div>
        <div className="text-center mb-6">
          <button
            // onClick={handleFilter}
            className="mt-8 border-2 py-3 px-5  hover:border-primary-color transition active:translate-y-[1px]"
          >
            <p>Apply filter</p>
          </button>
        </div>
        <div className="lg:text-sm">
          <span className="">Result: </span>
          <span>{numFilteredPrice} products</span>
        </div>
      </div>
    </AccordionsGeneral>
  );
}
