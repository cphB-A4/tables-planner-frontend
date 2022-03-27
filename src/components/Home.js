import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

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
     
        <h3>{content}</h3>
     
    </div>
  );
};

export default Home;
