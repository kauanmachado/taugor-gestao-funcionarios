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
    birthday: string;
}

interface EmployeeInfo {
    role: string;
    admissionDate: string;
    sector: string;
    salary: number;
    isFired?: boolean
}

interface PDFVersion {
    pdfPath: string; 
    date: Date; 
}

interface Histories {
    versions: PDFVersion[];
}

export interface IEmployee {
    id?: string;
    contactInfo: ContactInfo;
    employeeInfo: EmployeeInfo;
    employeePDF: string;
    histories: Histories
}