import { useEffect, useState } from "react"
import { IEmployee } from "../interfaces/IEmployee"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase/config"

export const useEmployees = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true)
            const querySnapshot = await getDocs(collection(db, 'employees'));
            const employeeData = querySnapshot.docs.map((doc) => {
                const data = doc.data()
                return {
                    id: doc.id,
                    contactInfo: data.contactInfo,
                    employeeInfo: data.employeeInfo,
                    employeePDF: data.employeePDF,
                    histories: data.histories
                } as IEmployee
            })
            setEmployees(employeeData)
            setLoading(false)
        };

        fetchEmployees()
    }, [])

    return {employees, loading}
}