import { Autocomplete, Pagination, TextField } from "@mui/material"
import Employee from "../components/employee/card"
import Card from "../components/employee/card"
import { useState } from "react"
import { IEmployee } from "../interfaces/IEmployee"

const ITEMS_PER_PAGE = 5

const employeeList: IEmployee[] = Array.from({ length: 25 }, (_, index) => ({
    name: `Employee ${index + 1}`
}))

export const ListEmployees = () => {
    const [page, setPage] = useState<number>(1)

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedEmployees = employeeList.slice(startIndex, endIndex)

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

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
                <Employee />
            </div>

            <Pagination
                count={Math.ceil(employeeList.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                className="mt-6"
            />

        </div>
    )
}

const employeeNames = employeeList.map((employee) => employee.name)

const top100Films = [
    "kauan machado",]