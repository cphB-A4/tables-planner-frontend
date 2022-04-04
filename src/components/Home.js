import React, { useState, useEffect } from "react";

import { Col, Container, Row, Form, Button, FormControl, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import UserService from "../services/user.service";
import HowToUse from "../helper/howToUse";

const Home = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

   const { push } = useHistory();

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

  const onChange = (e) => {
    const eventId = e.target.value;
    setSearchQuery(eventId);
  };

   const onClick = (e) => {
  UserService.getEventById(searchQuery).then(
    (response) => {
      console.log(response);
      setContent(response.data);
      push("/svg/" + searchQuery);

    },
    (error) => {
      const _content =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setError(true)
      setContent(_content);
    }
  );
   };

  return (
    <div>
      <HowToUse />
      <div className="container mt-3">
        <header className="text-center jumbotron">
          <h3>SVG drawing</h3>
        </header>
        <p>Insert event-id for table plan</p>
      </div>
      <Form onChange={onChange} className="d-flex">
        <FormControl
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
        />
        <Button onClick={onClick} variant="outline-success">
          Search
        </Button>
      </Form>
      {error && (
        <Alert className="mt-3" variant="danger" onClose={() => setError(false)} dismissible>
          <Alert.Heading>Error</Alert.Heading>
          <p>{content}</p>
        </Alert>
      )}
    </div>
  );
};

export default Home;
