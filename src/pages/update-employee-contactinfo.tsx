import { useParams } from "react-router-dom"
import { UpdateContactInfo } from "../components/employee/update-contact-info"

export const UpdateEmployeeContactInfo = () => {
    const { id } = useParams()
    return (
        <div>
            <main className="md:p-10 flex flex-col lg:flex-row lg:gap-5 p-4 lg:p-10 lg:max-w-7xl lg:mx-auto lg:space-x-16 justify-center">
                <UpdateContactInfo employeeId={id!}/>
            </main> 
        </div>
    )
}