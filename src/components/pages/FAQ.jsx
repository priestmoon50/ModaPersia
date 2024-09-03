import React from "react";
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FAQ = () => {
  const theme = useTheme();

  return (
    <Container
      maxWidth="md"
      sx={{
        paddingTop: "2rem",
        paddingBottom: "2rem",
        backgroundColor: theme.palette.background.default,
        borderRadius: "8px",
        boxShadow: theme.shadows[4],
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
          color: theme.palette.primary.main,
        }}
      >
        Frequently Asked Questions
      </Typography>

      <Box>
        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">What is Modapersia and what do you offer?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              Modapersia is an online retail platform dedicated to offering a vast range of fashion products. Whether you are looking for the latest sneakers, trendy hoodies, or classic jeans, Modapersia has something for everyone. We curate our collection from top global brands, ensuring high quality and style. Our goal is to make fashion accessible to everyone by providing a seamless online shopping experience. We also offer regular sales and promotions to give our customers the best value for their money.
            </Typography>
            <Typography>
              Additionally, Modapersia is committed to sustainability. We collaborate with brands that focus on ethical production practices, and we are continuously exploring ways to reduce our carbon footprint. Our customers are encouraged to join us in our sustainability efforts by choosing eco-friendly products and participating in our recycling programs.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">How can I place an order?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              Placing an order on Modapersia is straightforward and user-friendly. Simply browse our collection, select the items you want, and add them to your cart. Once you have finished shopping, click on the cart icon to review your selections. At this stage, you can update quantities or remove items as needed.
            </Typography>
            <Typography>
              Proceed to checkout where you will be asked to provide your shipping information. After confirming your details, you will be prompted to select a payment method. We accept PayPal, Visa, MasterCard, and Klarna. You will also have the option to apply any discount codes before finalizing your purchase. After payment, you will receive an order confirmation email with a summary of your purchase and an estimated delivery date.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">Is my payment information secure?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              At Modapersia, we prioritize your security. Our website is secured with SSL (Secure Socket Layer) encryption, which ensures that all sensitive information you provide, such as credit card details, is transmitted securely. SSL encryption makes it virtually impossible for unauthorized parties to access your data during the transaction process.
            </Typography>
            <Typography>
              In addition to SSL, we support Verified by Visa and MasterCard SecureCode, which are additional layers of security provided by these card issuers. These services require cardholders to enter a unique password or code during checkout, further ensuring that the transaction is being conducted by the rightful owner of the card. We are committed to providing a safe and secure shopping environment for all our customers.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">How can I track my order?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              Tracking your order on Modapersia is simple. Once your order has been shipped, you will receive a confirmation email containing your tracking number and a link to the courier’s website. This allows you to monitor the progress of your delivery in real-time.
            </Typography>
            <Typography>
              Additionally, you can log into your Modapersia account and navigate to the "My Orders" section. Here, you will find detailed information about your current and past orders, including their tracking status. If you have any issues with tracking your order, our customer support team is available to assist you.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">What are the payment methods available?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              Modapersia offers a variety of payment options to ensure a convenient shopping experience. We accept major credit cards such as Visa and MasterCard. For those who prefer online payment methods, PayPal is also available, offering a fast and secure way to pay for your purchases. Klarna is another payment option we provide, allowing you to buy now and pay later or split your payment into manageable installments.
            </Typography>
            <Typography>
              Each of these payment methods is processed through secure channels to protect your financial information. If you have any specific questions regarding payment options or encounter any issues during checkout, our support team is here to help.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">What is SSL and how does it protect my information?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              SSL (Secure Socket Layer) is a technology that creates a secure, encrypted connection between your browser and the web server. This encryption ensures that all data transferred between your browser and the server remains private and secure. At Modapersia, we use SSL to protect your personal information, including your payment details, from being intercepted by unauthorized parties during online transactions.
            </Typography>
            <Typography>
              The presence of SSL on our website is indicated by a padlock icon in your browser's address bar and the "https://" prefix in the URL. This signifies that your connection is secure and that any information you enter is being transmitted securely. SSL is a standard security technology used by millions of websites to protect their users’ data.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">What is Klarna and how does it work?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              Klarna is a financial technology company that provides payment solutions for online shopping. With Klarna, you can choose from several payment options, including "Pay Later," which allows you to receive your goods before paying for them, and "Slice It," which lets you spread the cost of your purchase over several months. Klarna is trusted by millions of shoppers worldwide and is integrated into many e-commerce platforms to offer flexible payment plans.
            </Typography>
            <Typography>
              When you select Klarna at checkout, you will be redirected to Klarna’s secure portal where you can choose your preferred payment option. Klarna will notify you of your payment schedule and send reminders as due dates approach. This service is particularly useful if you want to try out products before committing to a full payment, or if you prefer to manage your finances by paying in installments.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">What is Verified by Visa?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              Verified by Visa (VbV) is an online security service that helps protect Visa cardholders when making purchases over the internet. This service provides an additional layer of security by requiring the cardholder to enter a password or code during the checkout process. This ensures that the transaction is being carried out by the authorized cardholder and not someone else.
            </Typography>
            <Typography>
              When you use a Visa card that is enrolled in the Verified by Visa program, you may be prompted to enter your password or one-time code before your transaction is processed. This verification process reduces the risk of fraud and unauthorized transactions. If you have not yet registered your Visa card for this service, you can do so through your bank’s website.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">What is MasterCard SecureCode?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              MasterCard SecureCode is a service offered by MasterCard that enhances the security of online transactions. It works by requiring cardholders to enter a private code during online purchases. This code is known only to the cardholder and their bank, adding an extra layer of protection against unauthorized use of the card.
            </Typography>
            <Typography>
              When you make a purchase online with a MasterCard that is enrolled in the SecureCode program, you will be prompted to enter your SecureCode before the transaction is approved. This helps ensure that even if someone else has your card number, they won’t be able to use it for online purchases without knowing the SecureCode. You can enroll your MasterCard in the SecureCode program through your bank.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">What is SSL and why is it important?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              SSL (Secure Socket Layer) is a standard security protocol that establishes an encrypted link between a web server and a browser. This ensures that all data transmitted between the web server and browser remains private and secure. SSL is essential for protecting sensitive information such as credit card numbers, login credentials, and other personal data from being intercepted by hackers.
            </Typography>
            <Typography>
              When you visit a website with SSL, you’ll see a padlock icon in the address bar, and the URL will begin with "https://". This indicates that the site is secure and that any information you enter will be encrypted. At Modapersia, we use SSL to protect all customer data, ensuring that your shopping experience is safe and secure.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion sx={{ marginBottom: "1rem", borderRadius: "8px" }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: theme.palette.primary.light,
              color: theme.palette.primary.contrastText,
              borderRadius: "8px",
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <Typography variant="h6">How can I contact customer service?</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: theme.palette.background.paper, padding: "1.5rem" }}>
            <Typography>
              At Modapersia, we are committed to providing excellent customer service. If you have any questions, concerns, or need assistance with an order, you can contact our customer service team in several ways. You can reach us by email at support@modapersia.com, where we aim to respond to all inquiries within 24 hours.
            </Typography>
            <Typography>
              Additionally, you can use our live chat feature available on our website for immediate assistance. Our customer service representatives are available to help you with any issues related to your order, payment, delivery, or product information. We also have a comprehensive FAQ section on our website that covers most common questions.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default FAQ;
