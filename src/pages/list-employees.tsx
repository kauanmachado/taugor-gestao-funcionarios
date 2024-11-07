import { Autocomplete, CircularProgress, Pagination, TextField } from "@mui/material"
import { Employee } from "../components/employee/card"
import { useEffect, useState } from "react"
import { useEmployees } from "../hooks/useEmployees"

const ITEMS_PER_PAGE = 5

export const ListEmployees = () => {
    
    const [page, setPage] = useState<number>(1)
    const {employees, loading} = useEmployees()
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
    const [searchValue, setSearchValue] = useState<string>("")
    const [filteredEmployees, setFilteredEmployees] = useState(employees)
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    useEffect(() => {
        setFilteredEmployees(employees)
    }, [employees])

    useEffect(() => {
        const filtered = employees.filter((emp: any) =>
            `${emp.contactInfo.name} ${emp.contactInfo.lastName}`.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredEmployees(filtered)
        setPage(1)
    }, [searchValue, employees])

    const handleDeleteEmployee = (id: string) => {
        setFilteredEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id))
    }

    const handleUpdateEmployee = () => {
        setFilteredEmployees([...employees])
    }

    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex)

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
                    options={filteredEmployees ? filteredEmployees.map((emp: any) => `${emp.contactInfo.name} ${emp.contactInfo.lastName}`) : []}
                    onChange={(_, value) => setSelectedEmployee(value)}
                    renderInput={(params) => (
                        <TextField {...params} label="Nome do funcionário" variant="outlined" onChange={(e) => setSearchValue(e.target.value)}/>
                    )}
                />
            </div>
            {loading ? (
                <CircularProgress color="primary" />
            ) : (
                <>
                    <div className="md:w-[600px] space-y-4">
                        {paginatedEmployees.map((employee) => (
                            <Employee key={employee.id} {...employee} onDelete={handleDeleteEmployee} onUpdate={handleUpdateEmployee}/>
                        ))}
                    </div>

                    <Pagination
                        count={Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        className="mt-6"
                    />
                </>
            )}

        </div>
    )
}