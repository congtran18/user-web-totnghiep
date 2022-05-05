import Navbar from './Navbar';
import Announcement from './Announcement';
import Footer from './Footer';

function Layout({ children }) {
	return (
		<div>
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
