import { BiSolidUser } from "react-icons/bi"

export const EmployeeHistory = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="flex flex-row gap-4 mb-6">
            <BiSolidUser className="text-gray-300 text-6xl" />
            <h1 className="font-bold text-xl">Histórico de <h1 className="text-baseBlue">Kauan Machado</h1></h1>
            </div>

            <div className="rounded shadow p-4 md:w-[600px]">
                teste
            </div>


        </div>
    )
}