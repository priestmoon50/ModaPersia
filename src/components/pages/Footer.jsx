import React from "react";
import { useTranslation } from "react-i18next"; // اضافه کردن useTranslation
import "./Footer.css";
import { Link } from "react-router-dom";
import { FaPaypal, FaCcVisa, FaCcMastercard, FaCcApplePay, FaLock, FaShieldAlt, FaShieldVirus } from "react-icons/fa";
import { SiKlarna, SiMicrosoft, SiGoogleplay } from "react-icons/si";

const Footer = () => {
  const { t } = useTranslation(); // فراخوانی useTranslation

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <h4>{t("footer.about.title")}</h4>
          <ul>
            <li><Link to="/agb">{t("footer.about.terms")}</Link></li>
            <li><Link to="/datenschutz">{t("footer.about.privacy")}</Link></li>
            <li><Link to="/impressum">{t("footer.about.imprint")}</Link></li>
            <li><Link to="/presse">{t("footer.about.press")}</Link></li>
            <li><Link to="/jobs">{t("footer.about.jobs")}</Link></li>
            <li><Link to="/responsibility">{t("footer.about.responsibility")}</Link></li>
            <li><Link to="/datenschutzeinstellungen">{t("footer.about.dataSettings")}</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>{t("footer.service.title")}</h4>
          <ul>
            <li><Link to="/snipes-clique">{t("footer.service.snipesClique")}</Link></li>
            <li><Link to="/kontakt">{t("footer.service.contact")}</Link></li>
            <li><Link to="/store-finder">{t("footer.service.storeFinder")}</Link></li>
            <li><Link to="/newsletter">{t("footer.service.newsletter")}</Link></li>
            <li><Link to="/infos-uber-klarna">{t("footer.service.klarnaInfo")}</Link></li>
            <li><Link to="/affiliate-program">{t("footer.service.affiliate")}</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>{t("footer.help.title")}</h4>
          <ul>
            <li><Link to="/raffles">{t("footer.help.raffles")}</Link></li>
            <li><Link to="/hilfeseiten">{t("footer.help.faq")}</Link></li>
            <li><Link to="/lieferung">{t("footer.help.delivery")}</Link></li>
            <li><Link to="/ruckversand">{t("footer.help.returns")}</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>{t("footer.contact.title")}</h4>
          <Link to="/contact">{t("footer.contact.contactUs")}</Link>
        </div>
      </div>

      <div className="footer-middle">
        <div className="footer-column">
          <h4>{t("footer.payment.title")}</h4>
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
          <h4>{t("footer.security.title")}</h4>
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
          <h4>{t("footer.app.title")}</h4>
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
          <h4>{t("footer.social.title")}</h4>
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
            <li><Link to="/products">{t("footer.categories.allBrands")}</Link></li>
            <li><Link to="/products">{t("footer.categories.sneakers")}</Link></li>
            <li><Link to="/products">{t("footer.categories.hoodies")}</Link></li>
            <li><Link to="/products">{t("footer.categories.jeans")}</Link></li>
            <li><Link to="/products">{t("footer.categories.tShirts")}</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ModaPersia. {t("footer.rights")}</p>
      </div>
    </footer>
  );
};

export default Footer;
