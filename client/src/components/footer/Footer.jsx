import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <a
        href="https://github.com/Aastha200"
        className="icon"
        target="_blank"
      >
        <FaGithub size={24} />
      </a>
      <a
        href="https://www.linkedin.com/in/aastha-kamboj-836512221/"
        className="icon"
        target="_blank"
      >
        <FaLinkedin size={24} />
      </a>
      <p>
        © {new Date().getFullYear()}{" "}
        <a
          href="#"
          target="_blank"
          className="aastha"
        >
         Aastha
        </a>
      </p>
    </footer>
  );
};

export default Footer;
