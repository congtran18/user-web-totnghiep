import ProductList from "./ProductList";
import Filter from "../Filter/Filter";

export default function MainContent({ productsList }) {
  return (
    <div
      className="grid grid-cols-product-category gap-x-4 items-start
    lg:grid-cols-[180px_1fr]
    sm:grid-cols-1
    "
    >
      <Filter productsList={productsList} />
      <ProductList productsList={productsList} />
    </div>
  );
}
