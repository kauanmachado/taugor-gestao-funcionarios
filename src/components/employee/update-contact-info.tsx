import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db, storage } from "../../firebase/config"
import { IEmployee } from "../../interfaces/IEmployee"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { EmployeePDF } from "./employee-pdf"
import { getStates } from "@brazilian-utils/brazilian-utils"
import { RiPencilFill } from "react-icons/ri"
import { v4 } from "uuid"
import { GoToList } from "../gotolist"

type DataProps = {
    employeeId: string
}

type FormValues = {
    name: string
    lastName: string
    email: string
    phone: string
    gender: string
    address: {
        cep: string
        logradouro: string
        number: number
        uf: string
    };
    birthday: string
    role: string
    sector: string
}

export const UpdateContactInfo = ({ employeeId }: DataProps) => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
    const [employee, setEmployee] = useState<IEmployee | null>(null)
    const [updatedEmployeeData, setUpdatedEmployeeData] = useState<IEmployee | null>(null)
    const ufs = getStates()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchEmployee = async () => {
            if (employeeId) {
                const docRef = doc(db, 'employees', employeeId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const employeeData = docSnap.data() as IEmployee
                    setEmployee(employeeData)

                    const updatedData = {
                        ...employeeData,
                        contactInfo: {
                            ...employeeData.contactInfo
                        },
                        employeeInfo: {
                            ...employeeData.employeeInfo,
                        },
                    }

                    setUpdatedEmployeeData(updatedData)
                }
            }
        }

        fetchEmployee()
    }, [employeeId])

    const generatePDF = async (input: HTMLElement): Promise<Blob> => {
        const pdf = new jsPDF('p', 'mm', 'a4')
        const canvas = await html2canvas(input, { scale: 2 })
        const imgData = canvas.toDataURL('image/jpeg', 1.0)
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, (210 * canvas.height) / canvas.width)
        return pdf.output('blob')
    }

    const generateAndUploadPdf = async (employee: IEmployee): Promise<string> => {
        const input = document.getElementById('document')
        if (input) {
            const pdfData = await generatePDF(input)
            const pdfRef = ref(storage, `funcionarios-pdf/${employee.contactInfo?.name}_${employee.contactInfo?.lastName}_updated_${v4()}.pdf`)
            await uploadBytes(pdfRef, pdfData)
            return getDownloadURL(pdfRef)
        }
        return ''
    }

    const handleUpdate: SubmitHandler<FormValues> = async (data) => {
        if (!employee || !updatedEmployeeData) return

        const updatedData = {
            ...updatedEmployeeData,
            contactInfo: {
                ...updatedEmployeeData.contactInfo,
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                gender: data.gender,
                birthday: data.birthday,
                address: {
                    ...updatedEmployeeData.contactInfo.address,
                    cep: data.address.cep,
                    number: data.address.number,
                    uf: data.address.uf,
                    logradouro: data.address.logradouro
                }
            }
        }

        setUpdatedEmployeeData(updatedData)

        const formattedDate = new Date().toLocaleDateString()

        try {
            const employeeRef = doc(db, 'employees', employeeId)
            const employeeDocSnap = await getDoc(employeeRef)

            if (!employeeDocSnap.exists()) {
                throw new Error('Funcionário não encontrado!')
            }

            // Verifica se o campo 'histories' existe e se 'versions' é um array
            const histories = employeeDocSnap.data()?.histories || {}
            const currentVersions = Array.isArray(histories?.versions)
                ? histories.versions
                : []

            // Cria a nova versão
            const updatedPdfURL = await generateAndUploadPdf(updatedData)
            const newVersion = {
                date: formattedDate,
                pdfPath: updatedPdfURL,
            }

            // Mantém as versões antigas e adiciona a nova versão ao final
            const updatedVersions = [...currentVersions, newVersion]

            // Atualiza o documento com o novo campo 'histories.versions'
            await updateDoc(employeeRef, {
                contactInfo: updatedData.contactInfo,
                'histories.versions': updatedVersions,  // Atualiza a lista de versões dentro de 'histories'
            })

            alert('Informações de contato atualizadas com sucesso!')
            navigate("/list-employees")
        } catch (error) {
            console.error('Erro ao atualizar informações do funcionário:', error)
            alert('Erro ao atualizar informações do funcionário. Tente novamente.')
        }
    }



    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
        return phoneRegex.test(phone) || "Formato de telefone inválido ou não preenchido"
    }

    const validateBirthday = (birthday: string) => {
        const today = new Date()
        const birthdayDate = new Date(birthday)

        if (isNaN(birthdayDate.getTime())) {
            return "Data de nascimento inválida"
        }

        if (birthdayDate > today) {
            return "Data de nascimento não pode ser posterior à data atual"
        }

        return true
    }

    return (
        <>
            <div className="lg:w-2/3 my-3 md:my-0">
                <GoToList />
                <div className="flex items-center gap-3 my-5">
                    <h2 className='text-xl font-bold'>Informações do funcionário</h2>
                    <RiPencilFill className="text-gray-400 text-lg" />
                </div >
                <p className="text-sm text-gray-600 mb-8">Atualize as informações de contato do funcionário</p>

                <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">

                        <div className="flex flex-col w-full">
                            <TextField
                                label="Nome"
                                variant="filled"
                                fullWidth
                                defaultValue={employee?.contactInfo.name}
                                {...register('name', { required: true })}
                            />
                            {errors.name && <span className='text-red-500 text-xs mt-1'>Nome é obrigatório</span>}
                            <p className='text-xs text-gray-500'>ex: Kauan</p>
                        </div>

                        <div className="flex flex-col w-full">
                            <TextField
                                label="Sobrenome"
                                variant="filled"
                                fullWidth
                                defaultValue={employee?.contactInfo.lastName}
                                {...register('lastName', { required: true })}
                            />
                            {errors.lastName && <span className='text-red-500 text-xs mt-1'>Sobrenome é obrigatório</span>}
                            <p className='text-xs text-gray-500'>ex: Machado</p>
                        </div>

                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <TextField
                                label="E-mail"
                                variant="filled"
                                fullWidth
                                defaultValue={employee?.contactInfo.email}
                                {...register('email', { required: true })}
                            />
                            {errors.email && <span className='text-red-500 text-xs mt-1'>Email é obrigatório</span>}
                        </div>

                        <div className="flex flex-col w-full">
                            <TextField
                                label="Telefone"
                                variant="filled"
                                fullWidth
                                defaultValue={employee?.contactInfo.phone}
                                {...register('phone', { required: true, validate: validatePhoneNumber })}
                            />
                            {errors.phone && <span className='text-red-500 text-xs mt-1'>{errors.phone.message}</span>}
                            <p className='text-xs text-gray-500'>ex: 5198517449</p>
                        </div>

                        <div className="flex flex-col w-full">
                            <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                <InputLabel id="gender">Gênero</InputLabel>
                                <Select
                                    labelId="gender"
                                    {...register("gender", { required: true })}
                                >
                                    <MenuItem value="masculino">Masculino</MenuItem>
                                    <MenuItem value="feminino">Feminino</MenuItem>
                                </Select>
                                {errors.gender && <span className='text-red-500 text-xs mt-1'>Gênero é obrigatório</span>}
                            </FormControl>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <TextField
                                label="CEP"
                                variant="filled"
                                fullWidth
                                defaultValue={employee?.contactInfo.address.cep}
                                {...register('address.cep', { required: true })}
                            />
                            {errors.address?.cep && <span className='text-red-500 text-xs mt-1'>CEP é obrigatório</span>}
                        </div>

                        <div className="flex flex-col w-full">
                            <TextField
                                label="Número"
                                variant="filled"
                                fullWidth
                                defaultValue={employee?.contactInfo.address.number}
                                {...register('address.number', { required: true, valueAsNumber: true, min: 1 })}
                            />
                            {errors.address?.number && <span className='text-red-500 text-xs mt-1'>Número incorreto ou não preenchido</span>}
                        </div>

                        <div className="flex flex-col w-full">
                            <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                <InputLabel id="uf">UF</InputLabel>
                                <Select
                                    labelId="uf"
                                    {...register("address.uf", { required: true })}
                                >
                                    {ufs.map((uf: any) => (
                                        <MenuItem key={uf.code.toString()} value={uf.code}>{uf.code}</MenuItem>
                                    ))}
                                </Select>
                                {errors.address?.uf && <span className='text-red-500 text-xs mt-1'>UF é obrigatório</span>}
                            </FormControl>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <TextField
                                label="Logradouro"
                                variant="filled"
                                fullWidth
                                defaultValue={employee?.contactInfo.address.logradouro}
                                {...register('address.logradouro', { required: true })}
                            />
                            {errors.address?.logradouro && <span className='text-red-500 text-xs mt-1'>Logradouro é obrigatório</span>}
                            <p className='text-xs text-gray-500'>ex: Rua Osvaldo Pires 333</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col w-full">
                            <TextField
                                label="Data de Nascimento"
                                variant="filled"
                                fullWidth
                                type="date"
                                defaultValue={employee?.contactInfo.birthday}
                                {...register('birthday', { required: true, validate: validateBirthday })}
                            />
                            {errors.birthday && <span className='text-red-500 text-xs mt-1'>{errors.birthday.message}</span>}
                        </div>
                    </div>

                    <Button type="submit" variant="contained" color="primary" sx={{ padding: '12px 24px', borderRadius: '20px', width: '100%' }}>
                        Salvar Alterações
                    </Button>
                </form>


            </div>
            {updatedEmployeeData && (
                <EmployeePDF employee={updatedEmployeeData} />
            )}
        </>
    )
}