import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { doc, updateDoc } from "firebase/firestore"
import { useForm } from "react-hook-form"
import { db } from "../../firebase/config"

type DataProps = {
    handleClose: () => void
    open: boolean
    employeeId: string
    onUpdate: () => void
}

type FormValues = {
    role: string
    sector: string
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

export const ModalPromoteEmployee = ({ open, handleClose, onUpdate, employeeId }: DataProps) => {
    const { handleSubmit, register, formState: { errors } } = useForm<DataProps>({
        mode: "onBlur",
        // resolver: zodResolver(schema)
    })

    const confirm = async (data: FormValues) => {

        try {
            const employeeRef = doc(db, "employees", employeeId)

            await updateDoc(employeeRef, {
                employeeInfo: {
                    role: data.role,
                    sector: data.sector
                }
            })

            alert("Funcionário promovido com sucesso!")
            handleClose()
            onUpdate()
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
                    Promoção de funcionário
                </Typography>
                <p className="text-sm text-gray-600">Preencha os dados do novo cargo do funcionário</p>
                <form onSubmit={handleSubmit(confirm)} className="flex flex-col gap-4">
                    <TextField
                        type="text"
                        label="Cargo"
                        variant="filled"
                        {...register("role")}
                    />
                    <TextField
                        type="text"
                        label="Setor"
                        variant="filled"
                        {...register("sector")}
                    />
                    <Button sx={{ borderRadius: '20px' }} type="submit" variant="contained">Confirmar promoção</Button>
                </form>
                <hr/>
                <div className="flex justify-between">
                    
                    <Button sx={{ borderRadius: '20px' }} onClick={() => handleClose()} color='error'>Cancelar</Button>
                </div>
            </Box>
        </Modal>
        </div>
    )
}