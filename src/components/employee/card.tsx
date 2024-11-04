import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { TiThMenu } from 'react-icons/ti';
import { ModalPromoteEmployee } from '../modals/modal-promote-employee';
import { ModalDeleteEmployee } from '../modals/modal-delete-employee';
import { useNavigate } from 'react-router-dom';
import { ModalUpdateContact } from '../modals/modal-update-contact';

export default function Employee() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openModal, setOpenModal] = useState(false)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const [openModalUpdateContact, setOpenModalUpdateContact] = useState(false)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)

  const handleOpenModal = () => {
    setOpenModal(true)
    handleClose()
  }
  const handleCloseModal = () => setOpenModal(false)


  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
    handleClose()
  }
  const handleCloseModalUpdateContact = () => setOpenModalUpdateContact(false)
  
  const handleOpenModalUpdateContact = () => {
    setOpenModalUpdateContact(true)
    handleClose()
  }
  const handleCloseModalDelete = () => setOpenModalDelete(false)
  const handleEmployeeHistory = () => {
    navigate('/employee-history')
    handleClose()
  }


  return (
    <ListItem alignItems="center" className="flex shadow rounded bg-white justify-between p-4">
      <ListItemAvatar>
        <Avatar alt="Kauan Machado" src="/static/images/avatar/3.jpg" />
      </ListItemAvatar>

      <div className="flex flex-col flex-grow ml-4">
        <p className="font-bold text-baseBlue">Kauan Machado</p>
        <p className="text-gray-600 text-sm">kauan@gmail.com</p>
        <p className="text-gray-600 text-sm">Desenvolvedor Web - Setor TI</p>
      </div>

      <div className="flex items-center">
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className="p-2"
        >
          <TiThMenu />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleEmployeeHistory}>Histórico do funcionário</MenuItem>
          <MenuItem onClick={handleOpenModalUpdateContact}>Atualizar informações de contato</MenuItem>
          <MenuItem onClick={handleOpenModal}>Promover funcionário</MenuItem>
          <MenuItem onClick={handleOpenModalDelete}>Demitir ou terminar contrato</MenuItem>
        </Menu>
      </div>
      
      <ModalUpdateContact open={openModalUpdateContact} handleClose={handleCloseModalUpdateContact} />
      <ModalPromoteEmployee open={openModal} handleClose={handleCloseModal} />
      <ModalDeleteEmployee open={openModalDelete} handleClose={handleCloseModalDelete} />
    </ListItem>
  )
}
