import { Button, ListItem } from "@mui/material"


type DataProps = {
    id: string
    pdfPath: string
    date: string
}

export const CardHistory = ({ pdfPath, date }: DataProps) => {
    const handleViewPDF = () => {
        if (pdfPath) {
            window.open(pdfPath, '_blank')
        } else {
            alert("PDF não disponível.")
        }
    }

    return (
        <ListItem alignItems="center" className="flex shadow rounded bg-white justify-between p-4">
            <div className="flex flex-col flex-grow ml-4">
                <p className="font-bold text-baseBlue">
                <p className="text-gray-800">Data de modificação</p> {date}
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