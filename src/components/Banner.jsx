import { useRouter } from 'next/router';

const Banner = () => {
	const router = useRouter();

	return (
		<div className="h-[100vh] md:h-[75vh] relative md:pl-10 bg-top bg-cover bg-[url('/Images/ecommerce-online.jpg')]">
			<div className='absolute bottom-1/3 left-16'>
				<h1 className='text-6xl md:text-8xl uppercase text-white font-heading drop-shadow-md'>
					DO AN TN
				</h1>
				<button
					onClick={() => router.push('/productlist')}
					className='uppercase border-2 px-6 py-2 mt-4 font-sans text-white text-lg drop-shadow-md'
				>
					Shop Now
				</button>
			</div>
		</div>
	);
}

export default Banner
