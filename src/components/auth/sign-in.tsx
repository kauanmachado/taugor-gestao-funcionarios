import { auth, googleProvider } from "../../firebase/config"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, TextField } from "@mui/material"
import { FcGoogle } from "react-icons/fc"
import logo from '../../assets/imgs/logo_taugor.png'
import { Link } from "react-router-dom"

const schema = z.object({
    email: z.string().email({ message: 'Por favor, insira um email válido.' }),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
})

type DataProps = z.infer<typeof schema>

export const SignIn = () => {

    const { handleSubmit, register, formState: { errors }, setError } = useForm<DataProps>({
        mode: "onBlur",
        resolver: zodResolver(schema)
    })

    console.log(auth?.currentUser?.email)

    const signIn = async (data: DataProps) => {
        const { email, password } = data

        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.error(err)
            setError("email", {
                type: "manual",
                message: "Credenciais incorretas. Verifique seu e-mail e senha."
            })
            setError("password", {
                type: "manual",
                message: "Credenciais incorretas. Verifique seu e-mail e senha."
            })
        }
    }

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (err) {
            console.error(err)
        }
    }

    

    return (
        <div className="flex flex-col md:flex-row shadow bg-white rounded-lg md:w-[1000px] p-4">

            <div className="md:w-1/2 flex flex-col justify-center items-center rounded-lg">
                <img src={logo} className="w-[150px]"></img>
                <p className="mt-2 mb-6 text-gray-800 font-bold">
                    Bem-vindo à plataforma Taugor Gestão de Funcionários!
                </p>

                <p className="mt-2 text-gray-800 mb-2">
                    Não possui conta?
                </p>
                <Link
                    to="/sign-up"
                    className="rounded"
                >
                    Clique aqui para se cadastrar
                </Link>
            </div>

            <div className="md:w-1/2 md:p-12">
                <form onSubmit={handleSubmit(signIn)} className="flex flex-col gap-4">
                    <TextField
                        id="email"
                        type="email"
                        label="E-mail"
                        variant="filled"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                    />
                    <TextField
                        id="password"
                        type="password"
                        label="Senha"
                        variant="filled"
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password ? errors.password.message : ""}
                    />
                    <Button type="submit" variant="contained" sx={{ padding: '12px 24px', borderRadius: '20px' }}>
                        Entrar
                    </Button>
                </form>
                <p className="font-bold text-gray-800 my-2 text-sm text-center">Ou</p>
                <Button type="submit" variant="outlined" startIcon={<FcGoogle />} onClick={signInWithGoogle} sx={{ padding: '12px 24px', borderRadius: '20px', width: '100%'}}>
                    Entrar com Google
                </Button>
            </div>

        </div>
    )
} 