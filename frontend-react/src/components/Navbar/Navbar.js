import './Navbar.css'

export default function Navbar(){
    return <nav className="nav">
        <div className="container">
            <div>
                <a href="/" className="site-title">NOTBNB</a>
            </div>
            <div>
                <ul className="nav-options">
                    <li>
                        <a href="/post">POST LISTING</a>
                    </li>
                    {/* <li>
                        <a href="/login">LOGIN / SIGN UP</a>
                    </li> */}
                </ul>
            </div>
        </div>
    </nav>
}