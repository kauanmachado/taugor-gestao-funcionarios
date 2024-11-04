import { Footer } from "./footer"
import { Header } from "./header"


export const Layout = ({ children }: any) => {
    return (
        <>
            <Header />
            <main className="min-w-[320px] min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    )
}