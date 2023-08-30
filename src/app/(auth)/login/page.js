import AuthForm from "@/components/auth/AuthForm"
import Logo from "@/components/brand/Logo"

export default function Login() {
    return (
        <div className="row mt-20">
            <div className="col-6">
                <div className="header">
                    <Logo />
                </div>
                <p className="mt-4 text-gray-500">
                    Sign in to continue.
                </p>
            </div>
            <div className="col-6 auth-widget">
                <AuthForm view="sign_in" />
            </div>
        </div>
    )
}