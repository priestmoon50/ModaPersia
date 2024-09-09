import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Grid, Typography, Box, IconButton, Container } from "@mui/material";
import {
  FaPaypal,
  FaCcVisa,
  FaCcMastercard,
  FaLock,
  FaShieldAlt,
  FaShieldVirus,
} from "react-icons/fa";
import { SiMicrosoft, SiGoogleplay } from "react-icons/si";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        padding: "2rem 0",
        mt: "2rem",
        borderTop: "1px solid #ddd",
    
        boxShadow: "inset 0px -5px 15px rgba(113, 6, 122, 0.3)", // سایه داخلی
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* بخش درباره ما */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              {t("footer.about.title")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
              <Box component="li">
                <Link to="/agb">{t("footer.about.terms")}</Link>
              </Box>
              <Box component="li">
                <Link to="/datenschutz">{t("footer.about.privacy")}</Link>
              </Box>
              <Box component="li">
                <Link to="/impressum">{t("footer.about.imprint")}</Link>
              </Box>
              <Box component="li">
                <Link to="/presse">{t("footer.about.press")}</Link>
              </Box>
              <Box component="li">
                <Link to="/jobs">{t("footer.about.jobs")}</Link>
              </Box>
              <Box component="li">
                <Link to="/responsibility">
                  {t("footer.about.responsibility")}
                </Link>
              </Box>
              <Box component="li">
                <Link to="/datenschutzeinstellungen">
                  {t("footer.about.dataSettings")}
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* بخش سرویس */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              {t("footer.service.title")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
              <Box component="li">
                <Link to="/snipes-clique">
                  {t("footer.service.snipesClique")}
                </Link>
              </Box>
              <Box component="li">
                <Link to="/kontakt">{t("footer.service.contact")}</Link>
              </Box>
              <Box component="li">
                <Link to="/store-finder">
                  {t("footer.service.storeFinder")}
                </Link>
              </Box>
              <Box component="li">
                <Link to="/newsletter">{t("footer.service.newsletter")}</Link>
              </Box>
              <Box component="li">
                <Link to="/affiliate-program">
                  {t("footer.service.affiliate")}
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* بخش کمک */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              {t("footer.help.title")}
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", padding: 0 }}>
              <Box component="li">
                <Link to="/raffles">{t("footer.help.raffles")}</Link>
              </Box>
              <Box component="li">
                <Link to="/hilfeseiten">{t("footer.help.faq")}</Link>
              </Box>
              <Box component="li">
                <Link to="/lieferung">{t("footer.help.delivery")}</Link>
              </Box>
              <Box component="li">
                <Link to="/ruckversand">{t("footer.help.returns")}</Link>
              </Box>
            </Box>
          </Grid>

          {/* بخش پشتیبانی */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Typography>Phone: 021-182838789</Typography>
            <Typography>
              Email:{" "}
              <a href="mailto:support@modapersia.com">support@modapersia.com</a>
            </Typography>
          </Grid>
        </Grid>

        {/* بخش پرداخت و امنیت */}
        <Grid container spacing={4} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {t("footer.payment.title")}
            </Typography>
            <Box>
              <IconButton sx={{ color: "#0070ba" }}>
                {" "}
                {/* رنگ آبی پی‌پل */}
                <FaPaypal size={40} />
              </IconButton>
              <IconButton sx={{ color: "#1a1f71" }}>
                {" "}
                {/* رنگ آبی ویسا */}
                <FaCcVisa size={40} />
              </IconButton>
              <IconButton sx={{ color: "#eb001b" }}>
                {" "}
                {/* رنگ قرمز مسترکارت */}
                <FaCcMastercard size={40} />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {t("footer.security.title")}
            </Typography>
            <Box>
              <IconButton sx={{ color: "#4caf50" }}>
                {" "}
                {/* رنگ سبز برای لاک */}
                <FaLock size={40} />
              </IconButton>
              <IconButton sx={{ color: "#0078d4" }}>
                {" "}
                {/* رنگ آبی برای مایکروسافت */}
                <SiMicrosoft size={40} />
              </IconButton>

              <IconButton>
                <SiGoogleplay size={40} />
              </IconButton>

              <IconButton sx={{ color: "#f9a825" }}>
                {" "}
                {/* رنگ زرد برای شیلد */}
                <FaShieldAlt size={40} />
              </IconButton>
              <IconButton sx={{ color: "#d32f2f" }}>
                {" "}
                {/* رنگ قرمز برای ویروس */}
                <FaShieldVirus size={40} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* بخش کپی‌رایت */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography>&copy; 2024 ModaPersia. {t("footer.rights")}</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
