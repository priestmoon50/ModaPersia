import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

// Importing icons from react-icons
import { FaPaypal, FaCcVisa, FaCcMastercard, FaCcApplePay, FaLock, FaShieldAlt, FaShieldVirus } from "react-icons/fa";
import { SiKlarna, SiMicrosoft, SiGoogleplay } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>About SNIPES</h4>
          <ul>
            <li><Link to="/agb">Terms & Conditions</Link></li>
            <li><Link to="/datenschutz">Privacy Policy</Link></li>
            <li><Link to="/impressum">Imprint</Link></li>
            <li><Link to="/presse">Press</Link></li>
            <li><Link to="/jobs">Jobs at SNIPES</Link></li>
            <li><Link to="/responsibility">Responsibility</Link></li>
            <li><Link to="/datenschutzeinstellungen">Data Protection Settings</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Service</h4>
          <ul>
            <li><Link to="/snipes-clique">SNIPES CLIQUE</Link></li>
            <li><Link to="/kontakt">Contact</Link></li>
            <li><Link to="/store-finder">Store Finder</Link></li>
            <li><Link to="/newsletter">Newsletter</Link></li>
            <li><Link to="/infos-uber-klarna">Information about Klarna</Link></li>
            <li><Link to="/affiliate-program">Affiliate Program</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Help</h4>
          <ul>
            <li><Link to="/raffles">Raffles</Link></li>
            <li><Link to="/hilfeseiten">Help/FAQ</Link></li>
            <li><Link to="/lieferung">Delivery</Link></li>
            <li><Link to="/ruckversand">Returns</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Service Mail</h4>
          <Link to="/contact">Contact Us!</Link>
        </div>
      </div>

      <div className="footer-middle">
        <div className="footer-column">
          <h4>Payment Methods</h4>
          <div className="payment-icons">
            <a href="/faq#payment" target="_blank" rel="noopener noreferrer">
              <FaPaypal size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="/faq#payment" target="_blank" rel="noopener noreferrer">
              <FaCcVisa size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="/faq#payment" target="_blank" rel="noopener noreferrer">
              <FaCcMastercard size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="/faq#payment" target="_blank" rel="noopener noreferrer">
              <SiKlarna size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="/faq#payment" target="_blank" rel="noopener noreferrer">
              <FaCcApplePay size={40} style={{ marginRight: "10px" }} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Secure Shopping</h4>
          <div className="trust-icons">
            <a href="/faq#security" target="_blank" rel="noopener noreferrer">
              <FaLock size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="/faq#security" target="_blank" rel="noopener noreferrer">
              <SiMicrosoft size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="/faq#security" target="_blank" rel="noopener noreferrer">
              <FaShieldAlt size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="/faq#security" target="_blank" rel="noopener noreferrer">
              <FaShieldVirus size={40} style={{ marginRight: "10px" }} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>SNIPES App</h4>
          <div className="app-icons">
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
              <FaCcApplePay size={40} style={{ marginRight: "10px" }} />
            </a>
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
              <SiGoogleplay size={40} style={{ marginRight: "10px" }} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-column">
          <ul>
            <li><Link to="/products">All Brands</Link></li>
            <li><Link to="/products">Sneakers</Link></li>
            <li><Link to="/products">Hoodies</Link></li>
            <li><Link to="/products">Jeans</Link></li>
            <li><Link to="/products">T-Shirts</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ModaPersia. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
