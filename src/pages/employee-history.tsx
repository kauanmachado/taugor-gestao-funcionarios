import { BiSolidUser } from "react-icons/bi"
import { CardHistory } from "../components/employee/card-history"

export const EmployeeHistory = () => {
    return (
        <div className="md:p-10 flex flex-col lg:flex-row lg:gap-5 p-4 lg:p-10 lg:max-w-7xl lg:mx-auto lg:space-x-16 justify-center items-center">
        <section className='lg:w-2/3 my-3 md:my-0'>
            <div className="flex flex-row gap-4 mb-6">
            <BiSolidUser className="text-gray-300 text-6xl" />
            <h1 className="font-bold text-xl">Histórico de <h1 className="text-baseBlue">Kauan Machado</h1></h1>
            </div>

            <CardHistory/>

        </section>
        </div>
    )
}