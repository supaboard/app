import { redirect } from "next/navigation"
import AuthForm from "@/components/auth/AuthForm"
import Logo from "@/components/brand/Logo"

export default async function Register() {
    if (process.env.NEXT_PUBLIC_SIGNUP_CLOSED === "true") {
        redirect("/login")
    }

    return (
        <div className="row mt-20">
            <div className="col-6">
                <div className="header">
                    <Logo />
                </div>
                <p className="mt-4 text-gray-500">
                    Create a new account to get started.
                </p>
            </div>
            <div className="col-6 auth-widget">
                <AuthForm view="sign_up" />
            </div>
        </div>
    )
}