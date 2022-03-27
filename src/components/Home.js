import React, { useState, useEffect } from "react";

import { Col, Container, Row, Form, Button } from "react-bootstrap";

import UserService from "../services/user.service";
import HowToUse from "../helper/howToUse";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        console.log(response)
        setContent(response.data.msg);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

          console.log(error)
        setContent(_content);
      }
    );
  }, []);

  return (
    <div>
     <HowToUse/>
        <h3>{content}</h3>
     
    </div>
  );
};

export default Home;
