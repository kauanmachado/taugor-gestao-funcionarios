import { Autocomplete, Pagination, TextField } from "@mui/material"
import Employee from "../components/employee/card"
import Card from "../components/employee/card"

export const ListEmployees = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="mb-6 flex flex-col justify-start">
            <h1 className="font-bold mb-6 text-xl">Lista de funcionários</h1>
            <Autocomplete
                className="md:w-[600px]"
                disablePortal
                options={top100Films}
                renderInput={(params) => <TextField {...params} label="Nome do funcionário" />}
            />
            </div>
            <div className="md:w-[600px] space-y-4">
                <Employee />
                <Employee />
                <Employee />
                <Employee />
                <Employee />
            </div>

            <Pagination count={10} color="primary" className="mt-6"/>

        </div>
    )
}

const top100Films = [
    "kauan machado",]