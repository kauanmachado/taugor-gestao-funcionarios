import { ListItem, Avatar, Button, Menu, MenuItem } from '@mui/material'
import { TiThMenu } from 'react-icons/ti'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ModalDeleteEmployee } from '../modals/modal-delete-employee'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/config'

export const Employee = ({ id, contactInfo, employeeInfo, employeePDF, onDelete }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openModalDelete, setOpenModalDelete] = useState(false)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => setAnchorEl(null)
  
  const handleRedirectPromoteEmployee = () => {
    navigate(`/promote-employee/${id}`)
  }

  const handleRedirectEmployeeHistory = () => {
    navigate(`/employee-history/${id}`)
  }

  const handleRedirectUpdateContact = () => {
    navigate(`/update-employee-contactinfo/${id}`)
  }

  const handleOpenModalDelete = () => {
    setOpenModalDelete(true)
    handleClose()
  }

  const handleCloseModalDelete = () => setOpenModalDelete(false)

  const handleDelete = async () => {
    try {
      const employeeDocRef = doc(db, 'employees', id)
      await deleteDoc(employeeDocRef)
      console.log(`Funcionário com ID: ${id} deletado com sucesso.`)
      handleCloseModalDelete()
      onDelete(id)
    } catch (err) {
      console.error("Erro ao deletar funcionário:", err)
      alert("Ocorreu um erro ao tentar deletar o funcionário.")
    }
  }


  const handleViewPDF = () => {
    if (employeePDF) {
      window.open(employeePDF, '_blank')
    } else {
      alert("PDF não disponível.")
    }
  }

  return (
    <ListItem alignItems="center" className="flex shadow rounded bg-white justify-between p-4">
      <Avatar alt={contactInfo && contactInfo.name ? contactInfo.name : ''} src={contactInfo && contactInfo.profilePicture ? contactInfo.profilePicture : ''} />
      <div className="flex flex-col flex-grow ml-4">
        <p className="font-bold text-baseBlue">
          {contactInfo && contactInfo.name ? contactInfo.name : 'Nome não disponível'} {contactInfo && contactInfo.lastName ? contactInfo.lastName : ''}
        </p>
        <p className="text-gray-600 text-sm">{contactInfo && contactInfo.email ? contactInfo.email : 'Email não disponível'}</p>
        <p className="text-gray-600 text-sm">
          {employeeInfo && employeeInfo.role ? employeeInfo.role : 'Cargo não disponível'} - {employeeInfo && employeeInfo.sector ? employeeInfo.sector : 'Setor não disponível'}
        </p>
      </div>
      <Button onClick={handleViewPDF} className="p-2" color="primary">
        Visualizar PDF
      </Button>
      <Button onClick={handleClick} className="p-2">
        <TiThMenu />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleRedirectEmployeeHistory}>Histórico do funcionário</MenuItem>
        <MenuItem onClick={handleRedirectUpdateContact}>Atualizar informações de contato</MenuItem>
        <MenuItem onClick={handleRedirectPromoteEmployee}>Promover funcionário</MenuItem>
        <MenuItem onClick={handleOpenModalDelete}>Demitir ou terminar contrato</MenuItem>
      </Menu>

      <ModalDeleteEmployee
        open={openModalDelete}
        handleClose={handleCloseModalDelete}
        onConfirm={handleDelete} />
    </ListItem>
  );
};
