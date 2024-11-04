import { getStates } from "@brazilian-utils/brazilian-utils"
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material"
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
    const ufs = getStates()

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
                    </form>
                    <hr />
                    <div className="flex justify-between">
                        <Button sx={{ borderRadius: '20px' }} variant="contained" onClick={confirm}>Confirmar alterações</Button>
                        <Button sx={{ borderRadius: '20px' }} onClick={() => handleClose()} color='error'>Cancelar</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}