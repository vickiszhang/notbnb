import './NavbarHome.css'

export default function NavbarHome(){
    return <nav className="nav-home">
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
        <div className="header-text">
            <h1>Plan your next vacation.</h1>
        </div>
    </nav>
}