import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import SVG from "react-inlinesvg";

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

  const initialValueTable = { shape: "square", size: 2, tableId: -1 };
  const [table, setTable] = useState(initialValueTable);

  const initialValueNewTable = { shape: "square", size: "" };
  const [newTable, setNewTable] = useState(initialValueNewTable);
  
  const initialValueNewPerson = { name: ""};
  const [newPerson, setNewPerson] = useState(initialValueNewPerson);

  //svg state
  const [showSvg, setShowSvg] = useState("");

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

  const generateSvg = () => {
    console.log(id)
      UserService.getSvgById(id).then(
        (response) => {
          console.log(response);
          setShowSvg(response.data);
       

          
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setShowSvg(_content);

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
  }
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

  //createPerson; //Might change to handleCreatePersons
  const handleCreatePerson = (evt) => {
    evt.preventDefault();
    console.log("SUBMIT!! --> handleCreatePerson");
    console.log(newPerson);
    const arr = evt.target.id.split(",");
    console.log(evt.target.id);
    const tableId = arr[1]
    console.log(tableId)
    UserService.createPerson(newPerson, tableId).then((response) => {
      console.log(response);
      updateContent();
    });
  };
  const onChangeNewTable = (evt) => {
    //const arr = evt.target.id.split(",");
    //const property = arr[1]
    //Shape harcoded for now
    const value = evt.target.value;
    setNewTable({ ...newTable, size: value, shape: "square" });

    console.log(newTable);
  };

  const onChangeNewPerson = (evt) => {
  
    
    const value = evt.target.value;
    setNewPerson({ ...newPerson, name: value });

    console.log(newPerson);
  };

  const deleteTable = (evt) => {
    evt.preventDefault();
    const tableId = evt.target.value
    UserService.deleteTable(tableId).then((response) => {
      console.log(response);
      updateContent();
    });
console.log('you clicked delete')
  }

  return (
    <div className="mt-2 mb-2">
      <h1 className="text-center">{content.title}</h1>
      <p>
        Event id: <strong>{content.id}</strong>
      </p>
      <p>
        Event description: <strong>{content.description}</strong>
      </p>
      <p>
        Event time: <strong>{content.time}</strong>
      </p>

      <h1 className="text-center mt-2">Your Tables</h1>
      {content.tablesList.at(0).id !== -1 ? (
        <>
          {content.tablesList.map((table, index) => (
            <div key={table} className="card bg-light mb-3">
              <div className="card-header">
                <h5 className="card-title">Table number {index}</h5>
              </div>
              <Form>
                <div className="form-group">
                  <label htmlFor="shape">Shape</label>
                  <select id={["shape", table.id]} className="form-select">
                    <option value={content.tablesList.at(index).shape}>
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
                    <option value={content.tablesList.at(index).size}>
                      {content.tablesList.at(index).size}
                    </option>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                  </select>
                </div>

                <button
                  onClick={handleTableSubmit}
                  className="btn btn-success mt-2"
                >
                  Save
                </button>
                <button
                  value={table.id}
                  onClick={deleteTable}
                  className="btn btn-danger mt-2"
                >
                  Delete
                </button>
              </Form>
              {console.log(content.tablesList.at(index).persons.length)}
              {content.tablesList.at(index).size >
              content.tablesList.at(index).persons.length ? (
                <>
                  {table.persons.map((person, index) => (
                    <>
                      <li key={person.id} id={["person", person.id]}>
                        {person.name}
                      </li>
                    </>
                  ))}
                  <>
                    <Form
                      id={["person", table.id]}
                      onSubmit={handleCreatePerson}
                    >
                      <div className="form-group">
                        <label htmlFor="person">Person</label>
                        <Input
                          type="text"
                          id={["person", table.id]}
                          className="form-control"
                          name="person"
                          onChange={onChangeNewPerson}
                        />
                      </div>
                      <button className="btn btn-info mt-2">Add Person</button>
                    </Form>
                  </>
                </>
              ) : (
                <>
                  <h4 className="mt-2">Persons:</h4>
                  {table.persons.map((person, index) => (
                    <>
                      <li key={[person, index]} id={["person", person.id]}>
                        {person.name}
                      </li>
                    </>
                  ))}
                  <div className="alert alert-danger" role="alert">
                    This table is full!
                  </div>
                </>
              )}
            </div>
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
              <option value={"square"}>Square</option>
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
            </select>
          </div>

          <button className="btn btn-success mt-3">Add Table</button>
        </Form>
      </>
      <div className="text-center mt-5">
        <h1 className="">Show Table Plan</h1>

        <button
          onClick={generateSvg}
          className="text-center btn btn-primary mt-3 mb-2"
        >
          Show SVG
        </button>
      </div>
      {showSvg !== "" ? (
        <div>
          <SVG src={showSvg} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default EventBoard