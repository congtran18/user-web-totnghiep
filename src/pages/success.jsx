import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { resetCart } from 'features/cartSlice';
import { useShootFireworks } from 'hooks/useShootFireworks'

const success = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        useShootFireworks()
        dispatch(resetCart())
    }, [])

    return (
        <>
            <Head>
                <title>Thanh toán thành công</title>
                <link rel="icon" href="/favicon.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={true} />
                <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <main
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="hidden sm:block">
                    <Image src="/Images/purchase.svg" objectFit="contain" width="300rem" height="350rem" />

                </div>
                <div className="sm:hidden block">
                    <Image src="/Images/purchase.svg" objectFit="contain" width="200rem" height="250rem" />

                </div>
                <div className="text-center">

                    {orderId !== null
                        ?
                        `Order has been created successfully. Your order number is ${orderId}`
                        : `Đặt mua hàng thành công, vào mục hóa đơn để kiểm tra!`

                    }
                </div>
                <div className="flex w-full mx-auto items-center justify-center space-x-6 ">
                <button className="mt-8 px-3 py-2 outline-none bg-themePink rounded-lg" onClick={() => router.push('/')}>Trang chủ</button>
                <button className="mt-8 px-3 py-2 outline-none bg-themePink rounded-lg" onClick={() => router.push('/orders')}>Kiểm tra hóa đơn</button>

                </div>

            </main>
        </>
    )
}

export default success
