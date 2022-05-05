import Head from 'next/head';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import Newsletter from '../components/Newsletter';
import StaticUtility from '../components/StaticUtility'
import Products from '../components/Products';
import Link from "next/link";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTotals } from '../Redux/cartSlice';
import axios from "axios";
import { getWishlist } from '../Redux/wishlistSlice';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Home() {

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const wishlist = useSelector((state) => state.wishlist.products);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTotals())
  }, [cart, dispatch]);


  useEffect(() => {
    async function getWishlistFromServer() {
      try {
        const response = await axios.get(`https://martiniapi.herokuapp.com/api/wishlist/find/${user?.id}`, {
          headers: {
            'auth-token': user?.authToken
          }
        });
        dispatch(getWishlist(response.data))
        return response.data
      } catch (error) {
        console.log(error);
      }
    }
    user && getWishlistFromServer();
  }, [user, dispatch])

  return (
    <>
      <Head>
        <title>Martini - Women appreal, jewellery & more</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <main>
        <Banner />
        {/* <Categories /> */}
        <h1 className="text-center tracking-wider font-medium mt-7 mb-6 bg-themePink p-2.5 text-base sm:text-xl ">Sản phẩm mới</h1>
        <Products />
        <Link href="/productlist/women" >
          <a className="flex items-center justify-center underline tracking-wide py-3 px-5 mx-auto bg-themePink hover:font-medium transition w-max">Xem tất cả sản phẩm</a>
        </Link>
        <h1 className="text-center tracking-wider font-medium mt-7 bg-themePink p-2.5 text-base sm:text-xl ">Dịch vụ</h1>
        <StaticUtility />
        <Newsletter />
        <ToastContainer
          position='bottom-right'
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </main>
    </>


  )
}
