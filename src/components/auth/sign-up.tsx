import { useState } from "react"
import { auth, googleProvider } from "../../firebase/config"
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button, TextField } from "@mui/material"
import logo from '../../assets/imgs/logo_taugor.png'
import { Link } from "react-router-dom"

const schema = z.object({
    email: z.string().email({ message: 'Por favor, insira um email válido.' }),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
})

type DataProps = z.infer<typeof schema>

export const SignUp = () => {

    const { handleSubmit, register, formState: { errors } } = useForm<DataProps>({
        mode: "onBlur",
        resolver: zodResolver(schema)
    })

    const signUp = async (data: DataProps) => {
        const { email, password } = data

        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch(err){
            console.error(err)
        } 
    }

    return (
        <div className="flex flex-col shadow bg-white rounded-lg md:w-[600px] p-12">
            <img src={logo} className="w-[150px] mb-8"></img>
            <h1 className="text-start font-bold">Preencha os dados para criar sua conta</h1>
            <form onSubmit={handleSubmit(signUp)} className="flex flex-col gap-4 my-4">
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
                        Criar minha conta
                    </Button>
                </form>

                <p className="mt-2 text-gray-800 mb-2">
                    Já uma possui conta?
                </p>
                <Link
                    to="/"
                    className="rounded"
                >
                    Clique aqui para entrar
                </Link>
        </div>
    )
} 