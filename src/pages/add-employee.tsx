import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { RiPencilFill } from 'react-icons/ri'
import { BiSolidUser } from 'react-icons/bi'
import { FaRegLightbulb } from 'react-icons/fa'
import { BsToggle2Off } from 'react-icons/bs'
import { AiOutlineArrowUp } from 'react-icons/ai'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useForm, SubmitHandler, useWatch } from 'react-hook-form'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from "../firebase/config"
import jsPDF from 'jspdf'
import { IEmployee } from '../interfaces/IEmployee'
import html2canvas from 'html2canvas'
import { EmployeePDF } from '../components/employee/employee-pdf'
import { getStates } from '@brazilian-utils/brazilian-utils'
import { v4 } from 'uuid'
import { ModalCreateEmployee } from '../components/modals/modal-create-employee'
import { addDoc, collection } from 'firebase/firestore'
import { formatDate } from '../functions/format-date'

const initialEmployeeState: IEmployee = {
  contactInfo: {
    name: '',
    lastName: '',
    email: '',
    gender: '',
    address: {
      cep: '',
      logradouro: '',
      number: 0,
      uf: '',
    },
    phone: '',
    profilePicture: null,
    birthday: new Date()
  },
  employeeInfo: {
    role: '',
    admissionDate: new Date(),
    sector: '',
    salary: 0,
  },
  histories: {
    user: ''
  },
  employeePDF: ''
};

export const AddEmployee = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<IEmployee>()
  const ufs = getStates()
  const [employee, setEmployee] = useState<IEmployee>(initialEmployeeState)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isRounded, setIsRounded] = useState<boolean>(false)
  const [pictureURL, setPictureURL] = useState<string>("")
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [pdfData, setPdfData] = useState<Blob | null>(null)
  const [employeePdfUrl, setEmployeePDFUrl] = useState<string>('')
  const employeeData = useWatch({ control })
  const employeesCollectionRef = collection(db, "employees")

  const onSubmit: SubmitHandler<IEmployee> = (data) => {
    setEmployee(data)
    handleOpen()
    uploadImage()
    generateAndUploadPdf()
  }

  function handleSelectedPicture(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const picture = e.target.files[0]
      setEmployee((prev: any) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          profilePicture: picture
        }
      }));

      if (picture) {
        const imageUrl = URL.createObjectURL(picture)
        setSelectedImage(imageUrl)
      }
    }
  }

  const uploadImage = async () => {
    if (employee.contactInfo.profilePicture && typeof employee.contactInfo.profilePicture !== 'string') {
      const picture: File = employee.contactInfo.profilePicture;
      const imageRef = ref(storage, `profile-pictures/${picture.name + v4()}`);
      await uploadBytes(imageRef, picture)
      const pictureURL = await getDownloadURL(imageRef)
      setPictureURL(pictureURL)

    }
  }

  const handleRounded = () => {
    setIsRounded(prev => !prev)
  }

  const generatePDF = async (input: HTMLElement) => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const canvas = await html2canvas(input, { scale: 2 })
    const imgData = canvas.toDataURL('image/jpeg', 1.0)
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, (210 * canvas.height) / canvas.width)

    return pdf.output('blob')
  }

  const generateAndUploadPdf = async () => {
    const input = document.getElementById('document')
    if (input) {
      const pdfData = await generatePDF(input)
      const pdfRef = ref(storage, `funcionarios-pdf/${employee.contactInfo.name}${employee.contactInfo.lastName}.pdf` + v4());
      await uploadBytes(pdfRef, pdfData)
      const pdfURL = await getDownloadURL(pdfRef)
      setEmployeePDFUrl(pdfURL)
    }
  }

  const addEmployee = async () => {

    const date = new Date()
    const formattedDate = formatDate(date)
    try {
      const initialPDFVersion = {
        date: formattedDate,
        pdfPath: employeePdfUrl
      }

      await addDoc(employeesCollectionRef, {
        contactInfo: {
          name: employeeData.contactInfo.name,
          lastName: employeeData.contactInfo.lastName,
          email: employeeData.contactInfo.email,
          gender: employeeData.contactInfo.gender,
          address: {
            cep: employeeData.contactInfo.address.cep,
            logradouro: employeeData.contactInfo.address.logradouro,
            number: Number(employeeData.contactInfo.address.number),
            uf: employeeData.contactInfo.address.uf,
          },
          phone: employeeData.contactInfo.phone,
          profilePicture: pictureURL,
          birthday: employeeData.contactInfo.birthday,
        },
        employeeInfo: {
          role: employeeData.employeeInfo.role,
          admissionDate: employeeData.employeeInfo.admissionDate,
          sector: employeeData.employeeInfo.sector,
          salary: Number(employeeData.employeeInfo.salary),
        },
        employeePDF: employeePdfUrl,
        histories: {
          versions: [initialPDFVersion]
        }
      })
    } catch (err) {
      console.error(err)
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

  const validateAdmission = (admission: string) => {
    const today = new Date()
    const admissionDate = new Date(admission)

    if (isNaN(admissionDate.getTime())) {
      return "Data de admissão inválida"
    }

    if (admissionDate > today) {
      return "Data de admissão não pode ser posterior à data atual"
    }

    return true
  }


  return (
    <div >

      <main className='md:p-10 flex flex-col lg:flex-row lg:gap-5 p-4 lg:p-10 lg:max-w-7xl lg:mx-auto lg:space-x-16 '>
        <section className='lg:w-2/3 my-3 md:my-0'>
          <h1 className='text-xl font-bold'>Fale-nos um pouco sobre você</h1>
          <p className='text-sm text-gray-500'>Diga quem você é, como os empregadores podem entrar em contato com você e qual a sua profissão.</p>

          <div className="flex items-center gap-3 my-5">
            <h2 className='text-xl font-bold'>Informações do funcionário</h2>
            <RiPencilFill className="text-gray-400 text-lg" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center w-full gap-5'>

            <div className="flex flex-col md:flex-row md:gap-5 w-full">
              <div className='flex flex-col lg:gap-5 lg:w-1/2'>
                <div className='w-full flex flex-col'>
                  <div className='flex flex-col w-full'>
                    <TextField
                      type="text"
                      label="Nome"
                      placeholder='Nome'
                      variant="filled"
                      {...register("contactInfo.name", { required: true })}
                    />
                    {errors.contactInfo?.name && <span className='text-red-500 text-xs'>Nome é obrigatório</span>}
                  </div>
                  <p className='text-xs text-gray-500'>ex: Kauan</p>
                </div>
                <div className='w-full flex flex-col'>
                  <div className='flex flex-col w-full'>
                    <TextField
                      type="text"
                      label="Sobrenome"
                      placeholder="Sobrenome"
                      variant="filled"
                      {...register("contactInfo.lastName", { required: true })}
                    />
                    {errors.contactInfo?.lastName && <span className='text-red-500 text-xs'>Sobrenome é obrigatório</span>}
                  </div>
                  <p className='text-xs text-gray-500'>ex: Silva</p>
                </div>
              </div>

              <div className='flex flex-col md:flex-row justify-center  lg:gap-3 lg:w-1/2'>
                <div className={`${selectedImage ? '' : 'px-5 py-10 bg-gray-50'} h-full flex justify-center items-center  rounded-md`}>
                  {selectedImage ? (
                    <div className='flex flex-col gap-3'>
                      <img src={selectedImage} alt="Selected" className={`h-40 w-40 object-cover h-[100px] w-[100px] ${isRounded ? 'rounded-full' : ''}`} />
                      <div className='flex items-center gap-3'>
                        {isRounded ? <BsToggle2Off onClick={handleRounded} className="text-3xl text-primaryColor cursor-pointer rotate-180" /> : <BsToggle2Off onClick={handleRounded} className="text-3xl text-gray-400 cursor-pointer" />}
                        <p className="text-sm">Foto Redonda</p>
                      </div>
                    </div>
                  ) : (
                    <BiSolidUser className="text-gray-300 text-6xl" />
                  )}
                </div>
                <div>
                  {selectedImage ? (<></>) : (
                    <>
                      <div className='flex items-center gap-3 mb-3'>
                        <p className="">Foto do Perfil</p>
                        <div className='rounded-full p-1 bg-gray-200'>
                          <FaRegLightbulb className="text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* O botão de upload é sempre visível */}
                  <div className='flex items-center gap-3'>
                    <label htmlFor='upload-photo' className='flex items-center gap-3'>
                      <div className='rounded-full p-1 bg-blue-500 cursor-pointer hover:bg-blue-300 transition-colors'>
                        <AiOutlineArrowUp className='text-white ' />
                      </div>
                    </label>
                    <p className='text-sm'>Adicionar Foto</p>
                    <input
                      type='file'
                      id='upload-photo'
                      // @ts-ignore
                      onChangeCapture={(e) => handleSelectedPicture(e)}
                      style={{ display: 'none' }}
                      {...register("contactInfo.profilePicture")}
                    />
                  </div>
                </div>

              </div>

            </div>

            <div className='flex flex-col gap-3 w-full'>
              <div className="w-full flex flex-col">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className='flex flex-col w-full'>
                    <TextField
                      type="text"
                      label="Cargo"
                      placeholder='Cargo'
                      variant="filled"
                      {...register("employeeInfo.role", { required: true })}
                    />
                    {errors.employeeInfo?.role && <span className='text-red-500 text-xs'>Cargo é obrigatório</span>}
                  </div>

                  <div className='flex flex-col w-full'>
                    <TextField
                      type="text"
                      label="Setor"
                      placeholder="Setor"
                      variant="filled"
                      {...register("employeeInfo.sector", { required: true })}
                    />
                    {errors.employeeInfo?.sector && <span className='text-red-500 text-xs'>Setor é obrigatório</span>}
                  </div>

                  <div className='flex flex-col w-full'>
                    <TextField
                      type="number"
                      label="Salário"
                      placeholder="Salário"
                      variant="filled"
                      {...register("employeeInfo.salary", { required: true, valueAsNumber: true, min: 1 })}
                    />
                    {errors.employeeInfo?.salary && <span className='text-red-500 text-xs'>Salário incorreto ou não preenchido</span>}
                  </div>
                </div>
                <p className='text-xs text-gray-500'>ex: Desenvolvedor</p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <div className='flex flex-col w-full'>
                    <TextField
                      type="text"
                      label="CEP"
                      placeholder="CEP"
                      variant="filled"
                      {...register("contactInfo.address.cep", { required: true })}
                    />

                    {(errors.contactInfo?.address?.cep) && <span className='text-red-500 text-xs'>CEP é obrigatório</span>}
                  </div>
                  <div className="flex gap-3">
                    <div className='flex flex-col w-full'>
                      <TextField
                        type="number"
                        label="Número"
                        placeholder="Número"
                        variant="filled"
                        {...register("contactInfo.address.number", { required: true, valueAsNumber: true, min: 1 })}
                      />
                      {errors.contactInfo?.address?.number && <span className='text-red-500 text-xs'>Número incorreto ou não preenchido</span>}
                    </div>

                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-filled-label">UF</InputLabel>
                      <Select
                        type="text"
                        labelId="demo-simple-select-filled-label"
                        {...register("contactInfo.address.uf", { required: true })}
                      >
                        {ufs.map((uf: any) => (
                          <MenuItem key={uf.code.toString()} value={uf.code}>{uf.code}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errors.address?.uf && <span className='text-red-500 text-xs mt-1'>UF é obrigatório</span>}

                  </div>
                </div>
                <div className='flex flex-col w-full'>
                  <TextField
                    type="text"
                    label="Logradouro"
                    placeholder="Logradouro"
                    variant="filled"
                    {...register("contactInfo.address.logradouro", { required: true })}
                  />
                  {errors.contactInfo?.address?.logradouro && <span className='text-red-500 text-xs'>Logadouro é obrigatório</span>}
                </div>
                <p className='text-xs text-gray-500'>ex: Rua Osvaldo Pires 333</p>
              </div>


              <div className='flex flex-col justify-center w-full gap-3'>
                <div className='flex flex-col gap-3'>
                  <div className='w-full flex flex-col'>
                    <div className="flex gap-3">
                      <div className='flex flex-col w-full'>
                        <TextField
                          type="text"
                          label="Telefone"
                          placeholder="Telefone"
                          variant="filled"
                          {...register("contactInfo.phone", {
                            required: "Telefone é obrigatório",
                            validate: validatePhoneNumber
                          })}
                        />
                        {errors.contactInfo?.phone && <span className='text-red-500 text-xs'>{errors.contactInfo.phone.message}</span>}
                      </div>
                      <div className='flex flex-col w-full'>
                        <TextField
                          type="email"
                          label="E-mail"
                          placeholder="E-mail"
                          variant="filled"

                          {...register("contactInfo.email", { required: true })}
                        />

                        {errors.contactInfo?.email && <span className='text-red-500 text-xs'>Email é obrigatório</span>}
                      </div>

                      <div className='flex flex-col w-full'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                          <InputLabel id="gender">Genero</InputLabel>
                          <Select
                            type="text"
                            labelId="gender"
                            {...register("contactInfo.gender", { required: true })}
                          >
                            <MenuItem value="masculino">Masculino</MenuItem>
                            <MenuItem value="feminino">Feminino</MenuItem>
                          </Select>
                        </FormControl>
                        {errors.contactInfo?.gender && <span className='text-red-500 text-xs'>Gênero é obrigatório</span>}
                      </div>
                    </div>
                    <p className='text-xs text-gray-500'>ex: (51) 99899-9999</p>
                  </div>
                  <div className='w-full flex flex-col'>
                    <div className="flex gap-3">
                      <div className='flex flex-col w-full'>
                        <TextField
                          label="Data de Admissão"
                          variant="filled"
                          fullWidth
                          type="date"
                          {...register('employeeInfo.admissionDate', { required: true, validate: validateAdmission })}
                        />
                        {errors.employeeInfo?.admissionDate && <span className='text-red-500 text-xs'>{errors.employeeInfo.admissionDate.message}</span>}
                      </div>
                      <div className='flex flex-col w-full'>
                        <TextField
                          label="Data de Nascimento"
                          variant="filled"
                          fullWidth
                          type="date"
                          {...register('contactInfo.birthday', { required: true, validate: validateBirthday })}
                        />
                        {errors.contactInfo?.birthday && <span className='text-red-500 text-xs'>{errors.contactInfo.birthday.message}</span>}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button type='submit' variant='contained' sx={{ padding: '12px 24px', borderRadius: '20px', width: '100%' }}>Salvar</Button>
          </form>
        </section>

        <EmployeePDF employee={employeeData} profilePicture={selectedImage} isRounded={isRounded} />
      </main>
      {(open && pictureURL != '' && employeePdfUrl != '') && <ModalCreateEmployee employee={employee} createEmployee={addEmployee} handleClose={handleClose} handleOpen={handleOpen} open={open} />}
    </div>
  )
}