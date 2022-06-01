import { GrFacebook, GrInstagram, GrTwitter } from "react-icons/gr";
import { FiMapPin } from "react-icons/fi";
import { BiPhone } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
    return (
        <>
            <div className="flex sm:space-x-20 space-x-2  p-2 bg-[whitesmoke] flex-col sm:flex-row">
                {/* left side div  */}
                <div className="flex-1 flex flex-col p-6 ">
                    {/* logo  */}
                    <h1 className="font-bold text-xl sm:text-3xl sm:mb-8 mb-3">DO AN TN</h1>

                    {/* description  */}
                    <p className="font-medium text-gray-600 tracking-wide text-xs sm:text-base mb-5 text-justify">Là trang web mà người dùng có thể mua sách, học tiếng anh với các gia sư có năng lực và trình độ, đồng thời người dùng còn có thể đăng kí làm gia sư và giảng dạy nếu được admin phê duyệt</p>

                    {/* social icons  */}
                    <div className="flex space-x-5 ">
                        <GrFacebook size="1.5rem" color="#3b5998" />
                        <GrInstagram size="1.5rem" color="#DD2A7B" />
                        <GrTwitter size="1.5rem" color="#1DA1F2" />
                    </div>
                </div>

                {/* center div  */}
                <div className="flex-1 p-6 ">
                    {/* title  */}
                    <h1 className="font-bold text-base sm:text-2xl sm:mb-8 mb-4">Liên kết</h1>

                    {/* links list  */}
                    <ul className="cursor-pointer font-medium text-gray-600 tracking-wide flex flex-wrap flex-col sm:h-44 space-y-1 h-36 text-[14px] sm:text-base text-justify">
                        <li className="hover:text-black transition">Home</li>
                        <li className="hover:text-black transition">Cart</li>
                        <li className="hover:text-black transition">Man Fashion</li>
                        <li className="hover:text-black transition">Woman Fashion</li>
                        <li className="hover:text-black transition">Accessories</li>
                        <li className="hover:text-black transition">My Account</li>
                        <li className="hover:text-black transition">Track Order</li>
                        <li className="hover:text-black transition">Wishlist</li>
                        <li className="hover:text-black transition">About Us</li>
                        <li className="hover:text-black transition">Contact Us</li>
                    </ul>
                </div>

                {/* right side div  */}
                <div className="flex-1 p-6">
                    {/* contact heading  */}
                    <h1 className="font-bold text-xl sm:text-2xl sm:mb-8 mb-5" >Liên lạc</h1>
                    {/* address  */}
                    <p className="flex items-center mb-4 text-[14px] sm:text-base font-medium text-gray-600 tracking-wide"><FiMapPin size="1.3rem" style={{ marginRight: "1rem" }} />VietNam, DaNang, NT</p>
                    {/* contact number  */}
                    <p className="flex items-center mb-4 text-[14px] sm:text-base font-medium text-gray-600 tracking-wide"><BiPhone size="1.3rem" style={{ marginRight: "1rem" }} />+84 0944 066 088</p>

                    {/* contact email  */}
                    <p className="flex items-center mb-4 text-[14px] sm:text-base font-medium text-gray-600 tracking-wide"><HiOutlineMail size="1.3rem" style={{ marginRight: "1rem" }} />congtran@gmail.com</p>
                </div>
            </div>
        
            <div className="flex items-center justify-center h-8 bg-themePink text-center tracking-wider text-sm sm:text-base">
            <p>Copyright @ DO AN TN. 2022</p>
            </div>
        </>
    )
}

export default Footer
