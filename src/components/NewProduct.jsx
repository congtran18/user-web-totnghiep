import { useGetProductsQuery } from 'features/productSlice'
import { useRouter } from "next/router";
import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import CostFormat from 'helpers/CostFormat'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const NewProduct = () => {

    const router = useRouter();

    const { data } = useGetProductsQuery({ "page": 1 })

    const handleClickSimilarProduct = (product) => {
        router.push(`/productlist/${product?._id}`);
    };

    return (
        <div >
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={30}
                slidesPerView={5}
                navigation={{ clickable: true }}
                // scrollbar={{ draggable: true }}
                pagination
                // onSlideChange={() => console.log('slide change')}
                // onSwiper={(swiper) => console.log(swiper)}
            >
                {data && data.data.product.map((product) => {
                    return (
                        <SwiperSlide className="ml-1">
                            <button onClick={handleClickSimilarProduct.bind(null, product)}>
                                <div className="flex flex-col border-4 shadow-lg">
                                    {product.mainImage && <div className="bg-background-grayec relative h-[200px] ">
                                        <Image
                                            src={product.mainImage}
                                            width="240px"
                                            height="200px"
                                            alt=""
                                            objectFit="fill"
                                            className="border-dashed border-2 border-sky-500"
                                        />
                                    </div>}

                                    <div className="p-4 bg-white flex-1  flex flex-col justify-between ">
                                        <h5 className="text-sm uppercase font-medium h-12 ">
                                            {product.realname}
                                        </h5>
                                        <div className="text-base font-semibold relative mb-2">
                                            {product.discount > 0 && (
                                                <div className="absolute -top-[20px] right-[0px] text-[12px] text-gray-500 line-through">{`$ ${CostFormat(product.cost.toString())}`}</div>
                                            )}
                                            {`${CostFormat(
                                                (product.cost -
                                                (product.cost * product.discount) / 100).toString()
                                            )}đ`}
                                        </div>
                                    </div>

                                    {product.status && (
                                        product.status === "Mới" ?
                                            <div className="absolute top-[8px] left-[8px] py-[7px] px-[10px] text-white bg-red-500 font-medium">
                                                {product.status}
                                            </div>
                                            : (product.status === "Nổi bật" && <div className="absolute top-[8px] left-[8px] py-[7px] px-[10px] text-white bg-blue-500 font-medium">
                                                {product.status}
                                            </div>)
                                    )}

                                    {product.discount > 0 && (
                                        <div className=" absolute bg-primary-color py-[5px] px-[10px] top-[8px] right-[8px]">
                                            <p className="text-lg font-semibold leading-none">
                                                {product.discount}%
                                            </p>
                                            <p className="text-[9px] font-semibold text-center">
                                                OFF
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </button>
                        </SwiperSlide>

                    )
                })}
            </Swiper>
        </div>
    )
}

export default NewProduct
