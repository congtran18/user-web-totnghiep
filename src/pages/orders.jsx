import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "./signin";
import Head from 'next/head';
import { FaCartArrowDown } from "react-icons/fa";
import Image from 'next/image';
import { useRouter } from "next/router";
import { useSession } from 'next-auth/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import CostFormat from 'helpers/CostFormat'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import moment from 'moment'
import SortOrder from 'components/FilterOrder/SortOrder'
import FilterOrder from 'components/FilterOrder/FilterOrder'
import { usePaginateOrders } from 'hooks/usePaginateOrders'
import { toast } from "react-toastify";

const orders = () => {

    const { user } = useSelector(
        (state) => state.user
    );

    const { data: session, status } = useSession();
    const router = useRouter();
    const { query } = router;

    const loading = status === "loading" ? true : false

    const {
        orders: data,
        totalOrders,
        error,
        isLoading,
        isLoadingMore,
        size,
        setSize,
        isReachingEnd,
    } = usePaginateOrders(session ? session.user.email : user.user && user.user.email)

    const handleViewProduct = (id) => {
        router.push(`/productlist/${id}`);
    };

    const handleSort = (id) => {
        try {
            const path = router.pathname;
            let newParams = {};

            if (id) {
                newParams = { ...query, sort: id };
            } else {
                const { sort, ...rest } = query;
                newParams = rest;
            }

            router.push({
                pathname: path,
                query: newParams,
            })
        } catch (error) {
            toast.error(error)
        }
    };

    const handleFilter = (id) => {
        try {
            const path = router.pathname;
            let newParams = {};

            if (id) {
                newParams = { ...query, type: id };
            } else {
                const { type, ...rest } = query;
                newParams = rest;
            }

            router.push({
                pathname: path,
                query: newParams,
            })
        } catch (error) {
            toast.error(error)
        }
    };


    let body = null

    if (isLoading || loading) {
        body = (
            <div className="w-full">
                <img src="/Images/loading2.gif" alt="loading" className="text-center flex items-center justify-center mx-auto mt-3 " />
            </div>)

    } else {
        body = (
            <>
                {/* inside main section  */}
                <section className="flex  w-full h-full">
                    <div className="flex flex-col w-full py-6 px-6 flex-3">
                        <div className="flex w-full justify-end">
                            {/* <p className="text-gray-700 text-sm sm:text-base">Showing <strong>All Orders</strong></p> */}
                            {data && data.length > 0 &&
                                <>
                                    <SortOrder onChange={handleSort} sort="sort" />
                                    <FilterOrder onChange={handleFilter} type="type" />
                                </>
                            }
                        </div>

                        {data && data.length === 0 && <div className="flex items-center justify-center w-full h-full my-16 flex-col">
                            <Image src="/Images/order.svg" objectFit="contain" width="300rem" height="200rem" />
                            <p className="my-10 text-sm sm:text-lg tracking-wide text-center text-gray-700">Không có hóa đơn nào, hãy đến danh mục sản phẩm để mua.</p>
                            <button type="button" onClick={() => router.push('/productlist')} className="bg-themePink py-2.5 px-5 w-max mx-auto text-base sm:text-lg transition shadow-md hover:font-medium">Danh sách sản phẩm</button>
                        </div>}
                        {/* main order div  */}
                        {data && data.map((order, index) => (
                            <div className="w-full bg-gray-200 mt-8 mb-0  p-4">
                                <div className="py-3 text-gray-700 border-b border-gray-400 mb-5 text-sm sm:text-base">Order Id : <strong># {order._id}</strong> </div>
                                <div className=" flex flex-col" key={index}>
                                    <div className="bg-white flex w-full py-3">
                                        {/* heading div with icon and order placed date  */}
                                        <div className="flex p-3 items-start">
                                            <FaCartArrowDown size="1.3rem" style={{ marginTop: "1px" }} />
                                            <div className="flex flex-col w-full ml-6 text-gray-700">
                                                <p className="text-xs sm:text-base font-medium tracking-wide">Ngày đặt: {moment(new Date(order.create_at)).format('DD/MM/YYYY')}</p>
                                                <p className="text-xs sm:text-base font-medium tracking-wide">Giờ đặt: {moment(new Date(order.create_at)).format('HH:mm:ss')}</p>
                                                <p className="font-medium text-xs sm:text-base">Loại: {order.paymentMethod === "Sách" ? <strong className="text-red-400">{order.paymentMethod.toUpperCase()}</strong> : <strong className="text-blue-400">{order.paymentMethod.toUpperCase()}</strong>} </p>
                                                {order.typeCourse && <p className="font-medium text-xs sm:text-base">Loại khóa học: <strong className="text-gray-500">{order.typeCourse.toUpperCase()}</strong></p>}
                                                <p className="font-medium text-xs sm:text-base">Giá trị : <strong>{CostFormat((order.totalPrice * 230).toString())}đ</strong></p>
                                            </div>
                                        </div>
                                        {order?.orderItems && <Swiper
                                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                                            slidesPerView={3}
                                            navigation={{ clickable: true }}
                                            scrollbar={{ draggable: true }}
                                            // pagination
                                            className="w-9/12 py-2 h-[9rem]"
                                        >
                                            {order?.orderItems?.map((singleOrder) => (
                                                <SwiperSlide className="ml-2">
                                                    <button onClick={handleViewProduct.bind(null, singleOrder.productId._id)}>
                                                        <div className="flex py-2 px-1 sm:p-3 shadow-md border my-1 hover:border-black transition-all" key={singleOrder.productId}>
                                                            <Image src={singleOrder?.productId.mainImage || 'https://cdn-icons.flaticon.com/png/512/5343/premium/5343420.png?token=exp=1636715134~hmac=6fa2179ff6d39aada58b7f88da790d5b'} objectFit="contain" height="90rem" width="80rem" alt="image" />
                                                            <div className="flex flex-col flex-3">
                                                                <p className="text-sm sm:text-base font-semibold text-gray-700">{singleOrder.productId.realname}</p>
                                                                <p className="text-xs sm:text-sm text-gray-500">sl: {singleOrder.qty}</p>
                                                                <p className="text-xs sm:text-sm text-gray-500 font-semibold">1sp : {CostFormat(singleOrder.productId.cost.toString())}đ</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </SwiperSlide>
                                            ))}

                                        </Swiper>}
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </section>
            </>
        )
    }

    if (!user && !session && !loading) {
        return <Redirect to="/" />
    }

    return (
        <>
            <Head>
                <title>Orders</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main>
                {/* <Announcement />
                <Navbar /> */}

                {/* orders section  */}
                <section className="sm:w-[90%] w-[95%] h-full flex flex-wrap items-center mx-auto my-10 ">
                    <div className="flex flex-col w-full -space-y-1 border-b border-gray-300 py-4">
                        <h1 className="font-semibold text-gray-800 text-lg sm:text-2xl">Danh sách hóa đơn</h1>
                        {/* <p className="text-gray-700 text-xs ">{user?.username}</p> */}
                    </div>
                    {body}
                    <button
                        className={`rounded-lg custombutton ml-[45%] p-2 ${isReachingEnd ?
                            'cursor-not-allowed'
                            : data.length === 0 && 'invisible'}`}
                        disabled={isLoadingMore || isReachingEnd || data.length === 0}
                        onClick={() => setSize(size + 1)}
                    >
                        {isLoadingMore
                            ? "Loading..."
                            : isReachingEnd
                                ? "No more"
                                : `Tải thêm (${totalOrders - data.length})`}
                    </button>
                </section>
            </main>
        </>
    )
}

export default orders
