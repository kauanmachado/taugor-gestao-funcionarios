import { Box, Button, Modal, Typography } from "@mui/material"

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

export const ModalDeleteEmployee = ({ open, handleClose }: DataProps) => {

    const confirm = () => {
        alert("Funcionário demitido.")
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
                    Deseja realmente terminar o contrato com este funcionário?
                </Typography>
                <hr/>
                <div className="flex justify-between">
                    <Button sx={{ borderRadius: '20px' }} variant="contained" onClick={confirm}>Confirmar demissão</Button>
                    <Button sx={{ borderRadius: '20px' }} onClick={() => handleClose()} color='error'>Cancelar</Button>
                </div>
            </Box>
        </Modal>
        </div>
    )
}