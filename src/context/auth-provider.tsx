import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/config"

interface AuthContextType {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provedor de autenticação para envolver o aplicativo
export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // Observa as mudanças de estado de autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            setLoading(false)
        })

        // Limpa o observador ao desmontar o componente
        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context
}
