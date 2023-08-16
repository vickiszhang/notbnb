import './Footer.css'

export default function Footer(){
    return <nav className="footer">
        <div className="footer-container">
            <div>
                <a href="/" className="site-title">NOTBNB</a>
            </div>
            <div>
                <ul className="nav-options">
                    <li>
                        <a href="/services">SERVICES</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
}