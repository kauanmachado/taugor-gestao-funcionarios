import { Box, Button, Modal, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"

type DataProps = {
    handleClose: () => void
    open: boolean
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

export const ModalUpdateContact = ({ open, handleClose }: DataProps) => {
    const { handleSubmit, register, formState: { errors } } = useForm<DataProps>({
        mode: "onBlur",
        // resolver: zodResolver(schema)
    })

    const confirm = () => {
        alert("Funcionário promovido!")
        handleClose()
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
                </form>
                <hr/>
                <div className="flex justify-between">
                    <Button sx={{ borderRadius: '20px' }} variant="contained" onClick={confirm}>Confirmar promoção</Button>
                    <Button sx={{ borderRadius: '20px' }} onClick={() => handleClose()} color='error'>Cancelar</Button>
                </div>
            </Box>
        </Modal>
        </div>
    )
}