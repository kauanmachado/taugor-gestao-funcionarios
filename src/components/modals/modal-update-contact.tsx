import { getStates } from "@brazilian-utils/brazilian-utils"
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material"
import { doc, updateDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { db } from "../../firebase/config"

type DataProps = {
    handleClose: () => void
    open: boolean
    employeeId: string,

}

type FormValues = {
    name: string
    lastName: string
    cep: string
    number: string
    uf: string
    logradouro: string
    email: string
    phone: string
    birthday: string
}
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: 2,
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
}

export const ModalUpdateContact = ({ open, handleClose, employeeId,  }: DataProps) => {
    const { handleSubmit, register, formState: { errors } } = useForm<DataProps>({
        mode: "onBlur",
        // resolver: zodResolver(schema)
    })
    const ufs = getStates()

    const confirm = async (data: FormValues) => {

        try {
            const contactRef = doc(db, "employees", employeeId)

            await updateDoc(contactRef, {
                contatoInfo: {
                    name: data.name,
                    lastName: data.lastName,
                    address: {
                        cep: data.cep,
                        number: data.number,
                        uf: data.uf,
                        logradouro: data.logradouro
                    },
                    email: data.email,
                    phone: data.phone,
                }
            })

            alert("Dados de contato atualizado com sucesso!")
            handleClose()
            // onUpdate()
        } catch (err) {
            console.error("Erro ao promover o funcionário:", err)
        }
    }
    return (
        <div>
            <Modal
                open={open}
                onClose={() => handleClose()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="flex flex-col gap-5">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Atualizar informações de contato
                    </Typography>
                    <p className="text-sm text-gray-600">Preencha os dados do novo cargo do funcionário</p>
                    <form onSubmit={handleSubmit(confirm)} className="flex flex-col gap-4">
                        <TextField
                            type="text"
                            label="Nome"
                            placeholder='Nome'
                            variant="filled"
                            {...register("contactInfo.name", { required: true })}
                        />
                        <TextField
                            type="text"
                            label="Sobrenome"
                            placeholder="Sobrenome"
                            variant="filled"
                            {...register("contactInfo.lastName", { required: true })}
                        />
                        <TextField
                            type="text"
                            label="CEP"
                            placeholder="CEP"
                            variant="filled"
                            {...register("contactInfo.address.cep", { required: true })}
                        />
                        <TextField
                            type="number"
                            label="Número"
                            placeholder="Número"
                            variant="filled"
                            {...register("contactInfo.address.number", { required: true, valueAsNumber: true })}
                        />
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
                        <TextField
                            type="text"
                            label="Logradouro"
                            placeholder="Logradouro"
                            variant="filled"
                            {...register("contactInfo.address.logradouro", { required: true })}
                        />
                        <TextField
                            type="text"
                            label="Telefone"
                            placeholder="Telefone"
                            variant="filled"
                            {...register("contactInfo.phone", { required: true })}
                        />
                        <TextField
                            type="email"
                            label="E-mail"
                            placeholder="E-mail"
                            variant="filled"

                            {...register("contactInfo.email", { required: true })}
                        />
                         <input {...register("contactInfo.birthday", { required: true })} type='date' className='input w-full' placeholder='Data de Nascimento' />
                         {errors.contactInfo?.birthday && <span className='text-red-500 text-xs'>Data de Nascimento é obrigatório</span>}
                        <Button sx={{ borderRadius: '20px' }} variant="contained" type="submit" >Confirmar alterações</Button>
                    </form>
                    <hr />
                    <div className="flex justify-between">
                        
                        <Button sx={{ borderRadius: '20px' }} onClick={() => handleClose()} color='error'>Cancelar</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}