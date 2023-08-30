import Image from "next/image"
import Link from "next/link"

const Logo = () => {
    return (
        <>
            <Link href="/">
                <div className="align-middle flex mt-1">
                    <div>
                        <Image src="/img/supaboard.svg" alt="Supaboard" width={28} height={28} />
                    </div>
                    <div className="text-xl font-extrabold ml-3">
                        Supaboard
                    </div>
                </div>
            </Link>
        </>
    )
}


export default Logo