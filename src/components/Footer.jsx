import React from 'react';
import './Footer.css'; // Import custom CSS for styling

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2>FarmConnect</h2>
                    <p>Your platform to sell farm products directly to customers.</p>
                </div>

                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p>Email: support@farmconnect.com</p>
                    <p>Phone: +1 234 567 890</p>
                    <p>Address: 123 FarmConnect St, Agriculture City</p>
                </div>

                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <ul className="social-links">
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 FarmConnect | All Rights Reserved</p>
            </div>
        </footer>
    );
}

export default Footer;

