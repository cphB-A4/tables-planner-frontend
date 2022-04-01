import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

import Dropdown from "react-bootstrap/Dropdown";
function EventBoard() {
  const { id } = useParams();

  //Data about whole event. Tables, persons..
  const initialValue = {
    title: "",
    description: "",
    id: "",
    time: "",
    tablesList: [{ id: -1, shape: "square", size: -2, persons: [] }],
  };
  const [content, setContent] = useState(initialValue);

  const initialValueTable = { shape: "sqaure", size: 2, tableId: -1 };
  const [table, setTable] = useState(initialValueTable);

  const initialValueNewTable = { shape: "sqaure", size: ''};
  const [newTable, setNewTable] = useState(initialValueNewTable);
  //const [event, setEvent] = useState({});

  const updateContent = () => {
    //Cheks which user is logged in. If user owns event --> Edit priviliges. If not --> view only.
    UserService.getEventById(id).then(
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

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  };
  useEffect(() => {
    updateContent();
  }, []);

  const onChange = (evt) => {
    setContent({
      ...content,
      [evt.target.id]: evt.target.value,
    });
  };

  const onTable = (evt) => {
    //content.tablesList
    const arr = evt.target.id.split(",");
    const property = arr[0];
    const tableId = arr[1];
    const value = evt.target.value;

    if (property === "shape") {
      setTable({ ...table, shape: value, tableId: tableId });
    }
    if (property === "size") {
      setTable({ ...table, size: value, tableId: tableId });
    }
    console.log(table);
  };

  const handleTableSubmit = (evt) => {
    evt.preventDefault();
    console.log("SUBMIT!!");
    console.log(table);
    UserService.editTable(table).then((response) => {
      console.log(response);
      updateContent();
    });
  };

  //handleCreateTable
  const handleCreateTable = (evt) => {
    evt.preventDefault();
    console.log("SUBMIT!! --> hadleCreateTable");
    console.log(newTable);
    UserService.createTable(newTable, content.id).then((response) => {
      console.log(response);
      updateContent();
    });
  };
  const onChangeNewTable = (evt) => {

    //const arr = evt.target.id.split(",");
    //const property = arr[1]
    //Shape harcoded for now
    const value = evt.target.value;
      setNewTable({ ...newTable, size: value, shape: 'square' });
    
    console.log(newTable);
  };

  return (
    <div>
      <h3 className="text-center">{content.title}</h3>
      <p>
        Event id: <strong>{content.id}</strong>
      </p>
      <p>
        Event description: <strong>{content.description}</strong>
      </p>
      <p>
        Event time: <strong>{content.time}</strong>
      </p>

      <h1 className="text-center mt-2 mb-2">Your Tables</h1>
      {content.tablesList.at(0).id !== -1 ? (
        <>
          {content.tablesList.map((table, index) => (
            <>
              <h2 id={index}>Table number {index}</h2>
              <Form onSubmit={handleTableSubmit}>
                <div className="form-group">
                  <label htmlFor="shape">Shape</label>
                  <select id={["shape", table.id]} className="form-select">
                    <option selected>
                      {content.tablesList.at(index).shape}
                    </option>
                    <option disabled value="circle">
                      Circle
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="size">Size</label>
                  <select
                    onChange={onTable}
                    id={["size", table.id]}
                    className="form-select"
                  >
                    <option defualtValue={content.tablesList.at(index).size}>
                      {content.tablesList.at(index).size}
                    </option>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                  </select>
                </div>

                <button className="btn btn-success">Save</button>
                <button className="btn btn-danger">Delete</button>
              </Form>
              {table.persons.map((person, index) => (
                <h3>Person</h3>
              ))}
            </>
          ))}
        </>
      ) : (
        <>
          <h2>Start adding tables now!</h2>
        </>
      )}
      <>
        <h2 className="mt-3">Add Table</h2>
        <Form onSubmit={handleCreateTable}>
          <div className="form-group">
            <label htmlFor="shape">Shape</label>
            <select id={["new", "shape"]} className="form-select">
              <option defaultValue={'square'}>Sqaure</option>
              <option disabled value="circle">
                Circle
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="size">Size</label>
            <select
              onChange={onChangeNewTable}
              id={["new", "size"]}
              className="form-select"
            >
              <option>Choose a size</option>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={8}>8</option>
            </select>
          </div>

          <button className="btn btn-success">Add Table</button>
        </Form>
      </>
    </div>
  );
}

export default EventBoard