import { FaListUl } from "react-icons/fa"
import { Logout } from "../components/auth/logout"
import { IoMdPersonAdd } from "react-icons/io"
import { Link } from "react-router-dom"

export const Home = () => {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto p-4">
                <Link to="/add-employee" className="col-span-2 flex items-center justify-center bg-baseBlue text-white p-4 h-[100px] shadow-lg rounded gap-2 hover:scale-105 transition-all">
                    <IoMdPersonAdd />
                    Adicionar funcionário
                </Link>
                <Link to="/list-employees" className="flex items-center justify-center bg-baseBlue text-white p-4 h-[100px] shadow-lg rounded gap-2 hover:scale-105 transition-all">
                    <FaListUl />
                    Funcionários
                </Link>
                <Logout/>
            </div>
        </div>
    )
}

