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

type FormValues = {
  role: string
  sector: string
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
              admissionDate: employeeData.employeeInfo?.admissioDate,
              role: '',
              sector: ''
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
      },
    }
  
    setUpdatedEmployeeData(updatedData)
  
    const formattedDate = new Date().toLocaleDateString()
  
    try {
      const employeeRef = doc(db, 'employees', employeeId)
      const employeeDocSnap = await getDoc(employeeRef)
  
      if (!employeeDocSnap.exists()) {
        throw new Error('Funcionário não encontrado!')
      }
  
      const currentHistories = employeeDocSnap.data()?.histories || []
  
      const updatedPdfURL = await generateAndUploadPdf(updatedData)
  
      const newHistory = {
        date: formattedDate,
        pdfPath: updatedPdfURL,
      }
  
      const updatedHistories = [...currentHistories, newHistory]
  
      await updateDoc(employeeRef, {
        employeeInfo: updatedData.employeeInfo,
        histories: updatedHistories, 
        employeePDF: updatedPdfURL,   
      })
      alert('Funcionário promovido com sucesso!')
      navigate("/list-employees")
    } catch (error) {
      console.error('Erro ao promover funcionário:', error)
    }
  }

  return (

        <>
        {/* Formulário à esquerda */}
        <div className="lg:w-2/3 my-3 md:my-0">
          <Typography variant="h4" className="text-center font-semibold mb-4">
            Promoção de Funcionário
          </Typography>
          <p className="text-sm text-center text-gray-600 mb-8">Atualize os dados de cargo e setor do funcionário</p>
          
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
            </div>

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              className="rounded-full py-2"
            >
              Confirmar Promoção
            </Button>
          </form>

          <div className="mt-6 flex justify-between">
            <Button 
              onClick={() => window.history.back()} 
              color="error" 
              variant="outlined" 
              className="rounded-full py-2"
            >
              Cancelar
            </Button>
          </div>
        </div>

              <EmployeePDF
                employee={updatedEmployeeData}
                profilePicture={updatedEmployeeData?.profilePicture}
                isRounded={true}
              />
    </>

  )
}
