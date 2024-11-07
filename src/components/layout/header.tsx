import { IoMdHome } from "react-icons/io"
import { Link } from "react-router-dom"
import logo from "../../assets/imgs/logo_taugor.png"

export const Header = () => {

    return (
        <header className='flex flex-col md:flex-row items-center justify-between shadow bg-white md:h-[100px]'>
            <div className='flex justify-center items-center flex-col lg:flex-row md:border-r border-gray-300 h-full'>
                <Link to="/" className='hover:scale-105 transition-all'>
                    <img src={logo} alt='logo Taugor' width={180} height={109} />
                </Link>
            </div>


            <Link to="/" className="md:flex justify-center items-center hidden text-xl text-gray-400 p-5  border-l border-gray-300 h-full">
                <IoMdHome className="cursor-pointer transition-all hover:text-primaryColor hover:scale-105" />
            </Link>

        </header>
    )
}
