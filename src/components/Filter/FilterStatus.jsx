import React, { useMemo } from "react";
import AccordionsGeneral from "./AccordionsGeneral";
export default function AccordionCategory() {

  const selectCateHandler = (e) => {
    console.log("dep trai")
  };

  const categoryOptions = useMemo(() => {
    return [
      {
        id: 1,
        title: "Sale-off",
        quantity: 2,
      },
      {
        id: 2,
        title: "Limited",
        quantity: 2,
      },
      {
        id: 3,
        title: "Loved",
        quantity: 2,
      },
      {
        id: 4,
        title: "No filter",
        quantity: "",
      },
    ];
  }, []);

  return (
    <AccordionsGeneral heading="Status">
      <div className="px-6 pt-3 pb-5 mb-5 shadow-sm">
        {categoryOptions.map((option) => (
          <div
            className="flex items-center gap-x-5 mb-[30px] relative 
            lg:gap-x-3"
            key={option.id}
          >
            <div className="relative w-[18px] h-[18px]">
              <input
                onChange={selectCateHandler}
                type="radio"
                id={option.title.toLowerCase()}
                name="category"
                value={option.title.toLowerCase()}
                className={`appearance-none h-full w-full rounded-full border-2 transition ${
                  selectedStatus === option.title.toLowerCase()
                    ? "border-primary-color"
                    : "border-gray-600"
                }
                lg:h-[15px] lg:w-[15px]`}
              />
              {selectedStatus === option.title.toLowerCase() && (
                <div
                  className="absolute h-3 w-3 rounded-full bg-primary-color top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                lg:h-[10px] lg:w-[10px] lg:-translate-x-[6px] lg:-translate-y-[6.5px]"
                ></div>
              )}
            </div>

            <label
              htmlFor={option.title.toLowerCase()}
              className={`flex-1 flex items-center justify-between text-gray-600 transition relative ${
                selectedStatus === option.title.toLowerCase() &&
                "text-black font-medium"
              }`}
            >
              <p>{option.title}</p>
              <p>{option.quantity}</p>
            </label>
          </div>
        ))}
      </div>
    </AccordionsGeneral>
  );
}
