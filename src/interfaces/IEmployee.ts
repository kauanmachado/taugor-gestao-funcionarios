interface AddressInfo {
    cep: string;
    logradouro: string;
    number: number;
    uf: string;
}

interface ContactInfo {
    name: string;
    lastName: string;
    email: string;
    gender: string;
    address: AddressInfo;
    phone: string;
    profilePicture: File | null | string;
    birthday: Date;
}

interface EmployeeInfo {
    role: string;
    admissionDate: Date;
    sector: string;
    salary: number;
    isFired?: boolean
}

interface Histories {
    user: string
}

export interface IEmployee {
    id?: string;
    contactInfo: ContactInfo;
    employeeInfo: EmployeeInfo;
    employeePDF: string;
    histories: Histories
}