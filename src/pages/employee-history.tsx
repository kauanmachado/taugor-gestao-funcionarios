import { CardHistory } from "../components/employee/card-history"
import { useParams } from "react-router-dom"
import { useEmployees } from "../hooks/useEmployees"
import { Avatar, CircularProgress } from "@mui/material"
import { GoToList } from "../components/gotolist"

export const EmployeeHistory = () => {
    const { id } = useParams();
    const { employees, loading } = useEmployees();

    const employee = employees.find((emp) => emp.id === String(id))

    if (loading) return <CircularProgress color="primary" />;

    const sortedHistories = Array.isArray(employee?.histories?.versions)
        ? [...employee.histories.versions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .reverse()
        : [];

    return (
        <div className="md:p-10 flex flex-col lg:flex-row lg:gap-5 p-4 lg:p-10 lg:max-w-7xl lg:mx-auto lg:space-x-16 justify-center items-center">
            <section className="lg:w-2/3 my-3 md:my-0">
                <GoToList />
                <div className="flex flex-row gap-4 mb-6 mt-4">
                    <Avatar
                        alt={employee?.contactInfo?.name}
                        src={employee?.contactInfo?.profilePicture}
                        sx={{ width: 56, height: 56 }}
                    />
                    <h1 className="font-bold text-xl">
                        Histórico de<br /> 
                        <span className="text-baseBlue">{`${employee?.contactInfo?.name} ${employee?.contactInfo?.lastName}`}</span>
                    </h1>
                </div>

                <div className="space-y-4">
                    {sortedHistories.length > 0 ? (
                        sortedHistories.map((history, index) => (
                            <div key={index}>
                                {index === 0 && (
                                    <p className="text-sm font-semibold text-green-500 mb-1">
                                        Última versão
                                    </p>
                                )}
                                <CardHistory 
                                    id={employee?.id!} 
                                    pdfPath={history.pdfPath} 
                                    date={history.date} 
                                />
                            </div>
                        ))
                    ) : (
                        <p>Não há histórico disponível.</p>
                    )}
                </div>
            </section>
        </div>
    );
};
