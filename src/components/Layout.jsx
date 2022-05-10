import Navbar from './Navbar';
import Announcement from './Announcement';
import Footer from './Footer';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout({ children }) {
	return (
		<div>
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
			<Announcement />
			<Navbar />
			<div className='my-auto min-h-[60vh]'>{children}</div>
			<footer>
				<Footer />
			</footer>
		</div>
	);
}

export default Layout;
