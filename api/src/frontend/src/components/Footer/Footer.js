import React from "react";
import {
  Box,
  FooterContainer,
  Row,
  Column,
  Heading,
} from "./FooterStyles";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box>
      <FooterContainer>
        <Row>
          <Column>
            <Heading>Explore</Heading>
            <Link to="/" style={{ color: "white", textDecoration: "none", marginBottom: "0.5rem" }}>Home</Link>
            <Link to="/meals" style={{ color: "white", textDecoration: "none", marginBottom: "0.5rem" }}>Meals</Link>
          </Column>

          <Column>
            <Heading>Contact</Heading>
            <p style={{ color: "#ccc", fontSize: "14px" }}>
              Email: support@mealsharing.com
            </p>
            <p style={{ color: "#ccc", fontSize: "14px" }}>
              Phone: +1 234 567 890
            </p>
          </Column>
        </Row>

        <p style={{
          color: "#777",
          fontSize: "12px",
          textAlign: "center",
          marginTop: "2rem"
        }}>
          © {new Date().getFullYear()} Meal Sharing. All rights reserved.
        </p>
      </FooterContainer>
    </Box>
  );
};

export default Footer;
