import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article className="text-center text-white font-bold bg-tertiary h-[100vh] ">
            <h1 className="pt-[200px] text-xl">Oops!</h1>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link className="hover:text-xl" to="/">Back to login</Link>
            </div>
        </article>
    )
}

export default Missing