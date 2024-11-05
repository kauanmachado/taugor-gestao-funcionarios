import { getStorage, ref, getBytes, uploadBytes } from "firebase/storage";

export const copyPdf = async (oldPdfPath: string, newPdfPath: string) => {
    const storage = getStorage()

    try {
        if (!oldPdfPath) {
            throw new Error("Caminho do PDF original não pode ser vazio")
        }

        // Referência ao PDF original
        const oldPdfRef = ref(storage, oldPdfPath)

        // Obter os bytes do PDF original
        const pdfBytes = await getBytes(oldPdfRef)

        // Referência para o novo PDF
        const newPdfRef = ref(storage, newPdfPath)

        // Fazer upload dos bytes como um novo arquivo
        await uploadBytes(newPdfRef, pdfBytes)

        console.log("PDF copiado com sucesso para:", newPdfPath)
    } catch (error) {
        console.error("Erro ao copiar PDF:", error)
    }
};