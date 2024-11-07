import { useEffect, useState } from "react"
import { IEmployee } from "../../interfaces/IEmployee"

type EmployeeProps = {
    employee: IEmployee
}
export const EmployeePDF = ({ employee }: EmployeeProps) => {
    const [employeeToRender, setEmployeeToRender] = useState<IEmployee>(employee)

    useEffect(() => {
        setEmployeeToRender(employee)
    }, [employee])
    return (
        <section className='bg-gray-100 flex justify-center items-center lg:w-2/3 w-full '>
            <div className='bg-white a4 shadow-lg rounded-sm p-10 flex flex-col gap-3 w-full h-full min-h-[800px]'  id='document'>
                <div className="border border-baseBlue px-3 py-4">
                        <h1 className='text-baseBlue text-1xl font-bold'>{employeeToRender?.contactInfo?.name} {employeeToRender?.contactInfo?.lastName}</h1>
                        <p className='text-xs text-gray-500'>Telefone: {employeeToRender?.contactInfo?.phone}</p>
                        <p className='text-xs text-gray-500'>Email: {employeeToRender?.contactInfo?.email}</p>
                        <p className='text-xs text-gray-500'>Genero: {employeeToRender?.contactInfo?.gender}</p>
                        <p className='text-xs text-gray-500'>Aniversário: {employeeToRender?.contactInfo?.birthday}</p>
                    </div>
                <div className='border border-primaryColor px-3 py-4'>
                    <h1 className='text-baseBlue text-1xl font-bold'>Profissional:</h1>
                    <p className='text-xs text-gray-500'>Cargo: {employeeToRender?.employeeInfo?.role}</p>
                    <p className='text-xs text-gray-500'>Setor: {employeeToRender?.employeeInfo?.sector}</p>
                    <p className='text-xs text-gray-500'>Data de admissão: {employeeToRender?.employeeInfo?.admissionDate}</p>
                    <p className='text-xs text-gray-500'>Salário: R${employeeToRender?.employeeInfo?.salary}</p>
                </div>
                <div className='border border-primaryColor px-3 py-4'>
                    <h1 className='text-baseBlue text-1xl font-bold'>Endereço:</h1>
                    <p className='text-xs text-gray-500'>CEP: {employeeToRender?.contactInfo?.address?.cep}</p>
                    <p className='text-xs text-gray-500'>Logradouro: {employeeToRender?.contactInfo?.address?.logradouro}</p>
                    <p className='text-xs text-gray-500'>Número: {employeeToRender?.contactInfo?.address?.number}</p>
                    <p className='text-xs text-gray-500'>UF: {employeeToRender?.contactInfo?.address?.uf}</p>
                </div>
            </div>
        </section>
    )
}