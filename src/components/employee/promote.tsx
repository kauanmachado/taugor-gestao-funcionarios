import { useState, useEffect } from 'react'
import { TextField, Button, Typography } from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase/config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { IEmployee } from '../../interfaces/IEmployee'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { v4 } from 'uuid'
import { EmployeePDF } from '../employee/employee-pdf'
import { useNavigate } from 'react-router-dom'
import { RiPencilFill } from 'react-icons/ri'
import { GoToList } from '../gotolist'

type FormValues = {
  role: string
  sector: string
  salary: string
}

type DataProps = {
  employeeId: string
}

export const Promote = ({ employeeId }: DataProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const [employee, setEmployee] = useState<IEmployee | null>(null)
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState<IEmployee | null>(null)
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
              admissionDate: employeeData.employeeInfo?.admissionDate, // corrigido o nome da propriedade
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

  const handlePromotion: SubmitHandler<FormValues> = async (data) => {
    if (!employee || !updatedEmployeeData) return
  
    const updatedData = {
      ...updatedEmployeeData,
      employeeInfo: {
        ...updatedEmployeeData.employeeInfo,
        role: data.role,
        sector: data.sector,
        salary: data.salary
      },
    }
  
    setUpdatedEmployeeData(updatedData)
  
    const date = new Date()
    const formattedDate = date.toLocaleDateString()
  
    try {
      const employeeRef = doc(db, 'employees', employeeId)
      const employeeDocSnap = await getDoc(employeeRef)
  
      if (!employeeDocSnap.exists()) {
        throw new Error('Funcionário não encontrado!')
      }
  
      const currentHistories = employeeDocSnap.data()?.histories
        ? employeeDocSnap.data()?.histories
        : {}
  
      // Garante que o campo 'versions' exista como um array
      const currentVersions = Array.isArray(currentHistories.versions)
        ? currentHistories.versions
        : []
  
      const updatedPdfURL = await generateAndUploadPdf(updatedData)
  
      const newVersion = {
        date: formattedDate,
        pdfPath: updatedPdfURL,
      }
  
      // Atualizando o array de versões com o novo item
      const updatedVersions = [...currentVersions, newVersion]
  
      // Agora, atualizando o Firestore com o novo histórico e versão
      await updateDoc(employeeRef, {
        employeeInfo: updatedData.employeeInfo,
        histories: {
          ...currentHistories,
          versions: updatedVersions,  // Atualiza as versões
        },
        employeePDF: updatedPdfURL,
      })
  
      alert('Funcionário promovido com sucesso!')
      navigate("/list-employees")
    } catch (error) {
      console.error('Erro ao promover funcionário:', error)
      alert('Erro ao promover funcionário. Tente novamente.')
    }
  }
  

  return (
    <>
      {/* Formulário à esquerda */}
      <div className="lg:w-2/3 my-3 md:my-0">
        <GoToList />
        <div className="flex items-center gap-3 my-5">
          <h2 className='text-xl font-bold'>Informações do funcionário</h2>
          <RiPencilFill className="text-gray-400 text-lg" />
        </div >
        <p className="text-sm text-gray-600 mb-8">Atualize as informações de cargo e setor do funcionário</p>
        <form onSubmit={handleSubmit(handlePromotion)} className="space-y-4">
          <div>
            <TextField
              type="text"
              label="Novo Cargo"
              variant="filled"
              fullWidth
              {...register('role', { required: true })}
              className="mb-2"
            />
            {errors.role && <span className="text-red-500 text-xs">Cargo é obrigatório</span>}
            <p className='text-xs text-gray-500'>ex: Desenvolvedor</p>
          </div>

          <div>
            <TextField
              type="text"
              label="Novo Setor"
              variant="filled"
              fullWidth
              {...register('sector', { required: true })}
              className="mb-2"
            />
            {errors.sector && <span className="text-red-500 text-xs">Setor é obrigatório</span>}
            <p className='text-xs text-gray-500'>ex: TI</p>
          </div>

          <div>
            <TextField
              type="number"
              label="Salário"
              placeholder="Salário"
              variant="filled"
              fullWidth
              {...register("salary", { required: true, valueAsNumber: true, min: 1 })}
            />
            {errors.salary && <span className='text-red-500 text-xs'>Salário incorreto ou não preenchido</span>}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ padding: '12px 24px', borderRadius: '20px', width: '100%' }}
          >
            Confirmar Promoção
          </Button>
        </form>
      </div>

      <EmployeePDF
        employee={updatedEmployeeData}
        profilePicture={updatedEmployeeData?.profilePicture}
        isRounded={true}
      />
    </>
  )
}
