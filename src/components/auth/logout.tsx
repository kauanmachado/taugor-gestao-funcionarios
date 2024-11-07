import { auth } from "../../firebase/config"
import { signOut } from "firebase/auth"
import { IoMdLogOut } from "react-icons/io"

export const Logout = () => {

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <button onClick={logout} className="flex items-center justify-center bg-red-300 text-white p-4 h-[100px] shadow-lg rounded gap-2 text-red-500 border border-red-500 hover:scale-105 transition-all">
                <IoMdLogOut />
                Fazer logout
            </button>
        </div>
    )
}