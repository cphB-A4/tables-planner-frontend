import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { useParams, useHistory } from "react-router-dom";
import SVG from "react-inlinesvg";
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  FormControl,
  Alert,
} from "react-bootstrap";

const BoardSvg = () => {
  const [content, setContent] = useState("");
   const [error, setError] = useState(false);

    const { id } = useParams();
       const { push } = useHistory();
       

  useEffect(() => {
     UserService.getSvgById(id).then(
       (response) => {
         console.log(response);
         setContent(response.data);
       },
       (error) => {
         const _content =
           (error.response &&
             error.response.data &&
             error.response.data.message) ||
           error.message ||
           error.toString();
setError(true);
         setContent(_content);
       }
     );
  }, [id]);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>SVG DRAWING</h3>
      </header>
      {content !== "" ? (
        <div>
          <SVG src={content} />
        </div>
      ) : (
        ""
      )}
      {error && (
        <Alert className="mt-3" variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{content}</p>
          <div className="text-center">
            <button className="btn btn-dark" onClick={() => push("/home")}>
              Home
            </button>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default BoardSvg;
