import { Button, ListItem } from "@mui/material"

export const CardHistory = () => {
    const employeePDF = "TESTE"
    const handleViewPDF = () => {
        if (employeePDF) {
          window.open(employeePDF, '_blank')
        } else {
          alert("PDF não disponível.")
        }
    }

    return (
        <ListItem alignItems="center" className="flex shadow rounded bg-white justify-between p-4">
            <div className="flex flex-col flex-grow ml-4">
                <p className="font-bold text-baseBlue">
                Data de modificação: 23/02/2024
                </p>
                <p className="text-gray-600 text-sm"></p>
                <p className="text-gray-600 text-sm">

                </p>
            </div>
            <Button onClick={handleViewPDF} className="p-2" color="primary">
                Visualizar PDF
            </Button>
        </ListItem>
    )
}