import { useState, useEffect } from 'react'
import { Modal, Box, TextField, Button, Typography } from '@mui/material'
import { useForm, SubmitHandler } from 'react-hook-form'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase/config'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { IEmployee } from '../../interfaces/IEmployee'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { v4 } from 'uuid'
import { EmployeePDF } from '../employee/employee-pdf'

type FormValues = {
  role: string
  sector: string
}

type DataProps = {
  handleClose: () => void
  open: boolean
  employeeId: string
  onUpdate: () => void
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 2,
    width: '80%', 
    maxWidth: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    gap: '20px',
    maxHeight: '90vh', 
    overflow: 'auto',
}

export const ModalPromoteEmployee = ({ open, handleClose, employeeId, onUpdate }: DataProps) => {
  const { register, handleSubmit } = useForm<FormValues>()
  const [employee, setEmployee] = useState<IEmployee | null>(null)
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState<IEmployee | null>(null)


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
              ...employeeData.contatoInfo
            },
            employeeInfo: {
              ...employeeData.employeeInfo,
              role: '',
              sector: ''
            },
          }
          setUpdatedEmployeeData(updatedData)
        }
      }
    }

    if (open) {
      fetchEmployee()
    }
  }, [open, employeeId])

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
        ...updatedEmployeeData?.employeeInfo,
        role: data.role,
        sector: data.sector,
      },
    }

    setUpdatedEmployeeData(updatedData)

    const formattedDate = new Date().toLocaleDateString()

    try {
      const employeeRef = doc(db, 'employees', employeeId)
      await updateDoc(employeeRef, {
        employeeInfo: updatedData.employeeInfo,
        histories: arrayUnion({
          date: formattedDate,
        }),
      })

      const updatedPdfURL = await generateAndUploadPdf(updatedData)

      await updateDoc(employeeRef, {
        employeePDF: updatedPdfURL,
        histories: arrayUnion({
          date: formattedDate,
          pdfPath: updatedPdfURL,
        }),
      })

      onUpdate()
      handleClose()
      alert('Funcionário promovido com sucesso!')
    } catch (error) {
      console.error('Erro ao promover funcionário:', error)
    }
  }

  useEffect(() => {
    if (updatedEmployeeData) {
      generateAndUploadPdf(updatedEmployeeData)
    }
  }, [updatedEmployeeData]) 

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style} className="flex flex-col gap-5 ">
        <Typography id="modal-title" variant="h6" component="h2">
          Promoção de Funcionário
        </Typography>
        <p className="text-sm text-gray-600">Atualize os dados de cargo e setor do funcionário</p>
        <form onSubmit={handleSubmit(handlePromotion)} className="flex flex-col gap-4">
          <TextField
            type="text"
            label="Novo Cargo"
            variant="filled"
            {...register('role', { required: true })}
          />
          <TextField
            type="text"
            label="Novo Setor"
            variant="filled"
            {...register('sector', { required: true })}
          />
          <Button sx={{ borderRadius: '20px' }} type="submit" variant="contained">
            Confirmar Promoção
          </Button>
        </form>
        <div className="flex justify-between">
          <Button sx={{ borderRadius: '20px' }} onClick={handleClose} color="error">
            Cancelar
          </Button>
        </div>
        <EmployeePDF
          employee={updatedEmployeeData}
          profilePicture={updatedEmployeeData?.profilePicture}
          isRounded={true}
        />
      </Box>
    </Modal>
  )
}
