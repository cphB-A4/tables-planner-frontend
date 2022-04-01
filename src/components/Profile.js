import AuthService from "../services/auth.service";
import { Col, Container, Row, Button } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import EventTable from "./ProfileEventTable";
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  const initialValue = { title: "", description: "", time: "" };
  const [event, setEvent] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
   const [successful, setSuccessful] = useState(false);
   const [content, setContent] = useState([]); const [eventsToShow, setEventsToShow] = useState([]);

   const [eventId, setEventId] = useState(undefined)

  const form = useRef();
  const checkBtn = useRef();
  const { push } = useHistory();

  const getAllEventsByUser = () => {
    //Get all events by user id
    UserService.getAllEventsByUser().then(
      (response) => {
        console.log(response.data);
        //setContent(response.data.msg);
        setEventsToShow(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  useEffect(() => {
    getAllEventsByUser()
  }, []);

  const onChange = (evt) => {
    setEvent({
      ...event,
      [evt.target.id]: evt.target.value,
    });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    //check if some inputs are empty. If yes --> error
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      UserService.createEvent(event).then(
        (response) => {
          console.log(response);
          setEventId(response.data.id);
          setMessage("Event succesfully created");
          setSuccessful(true);
          //Update event table
          getAllEventsByUser()
        },
        (error) => {
          console.log(error)
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}'s</strong> Profile
        </h3>
      </header>

      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
      <h1>Create event</h1>
      <Form onSubmit={handleSubmit} ref={form}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            id="title"
            className="form-control"
            name="title"
            value={event.title}
            onChange={onChange}
            validations={[required]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <Input
            type="text"
            id="description"
            className="form-control"
            name="description"
            value={event.description}
            onChange={onChange}
            validations={[required]}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Date & Time</label>
          <Input
            type="datetime-local"
            id="time"
            className="form-control"
            name="time"
            value={event.time}
            onChange={onChange}
            validations={[required]}
          />
        </div>

        <div className="form-group mt-2 text-center">
          <button className="btn btn-dark btn-block" disabled={loading}>
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Create event</span>
          </button>
        </div>

        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message}
              <div className="text-center mt-2">
                <button
                  className="btn btn-dark  "
                  onClick={() => push("/event/" + eventId)}
                >
                  Link to Event
                </button>
              </div>
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
      </Form>
      {eventsToShow.length > 0 ? (
        <EventTable
          list={eventsToShow}
          setEventId={() => {
            console.log("implement me");
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
