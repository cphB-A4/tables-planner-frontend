import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { useParams } from "react-router-dom";
import SVG from "react-inlinesvg";

const BoardSvg = () => {
  const [content, setContent] = useState("");

    const { id } = useParams();

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
    </div>
  );
};

export default BoardSvg;
