import { IoIosArrowBack } from "react-icons/io"
import { Link,} from "react-router-dom"

export const GoToList = () => {
    return (
        <Link 
            to="/list-employees" 
            className="font-bold flex items-center gap-2 rounded-lg text-gray-800 hover:text-gray-600 transition-all duration-300"
        >
            <IoIosArrowBack className="text-gray-800 hover:text-gray-600" />
            <span className="text-gray-800 hover:text-gray-600">Voltar para a lista de funcionários</span>
        </Link>
    )
}