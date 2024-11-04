import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { IEmployee } from '../../interfaces/IEmployee';
import { useNavigate } from 'react-router-dom';
import { PiX } from 'react-icons/pi';

type DataProps = {
    handleOpen: Function
    handleClose: () => void
    open: boolean
    createEmployee: (employee: IEmployee) => void
    employee: IEmployee;
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


export const ModalCreateEmployee = ({ employee, open, handleClose, createEmployee }: DataProps) => {
    const navigate = useNavigate()
    const confirm = () => {
        createEmployee(employee)
        handleClose()
        alert("Funcionário criado com sucesso")
        navigate('/listar-funcionarios')
    }
    return (
        <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} className="flex flex-col gap-5">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Deseja realmente adicionar funcionário?
                </Typography>
                <hr/>
                <div className="flex justify-between">
                    <Button variant="contained" onClick={confirm}>Confirmar</Button>
                    <Button onClick={() => handleClose()} color='error'>Cancelar</Button>
                </div>
            </Box>
        </Modal>
    )
}