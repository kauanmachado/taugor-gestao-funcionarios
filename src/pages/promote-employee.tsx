import { useParams } from "react-router-dom"
import { Promote } from "../components/employee/promote"

export const PromoteEmployee = () => {
    const { id } = useParams()
    return (
        <div>
        <main className='md:p-10 flex flex-col lg:flex-row lg:gap-5 p-4 lg:p-10 lg:max-w-7xl lg:mx-auto lg:space-x-16 justify-center'>
            <Promote employeeId={id} />
        </main>
        </div>
    )
}