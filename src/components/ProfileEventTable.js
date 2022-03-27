import { Table } from "react-bootstrap";
import React from "react";
function EventTable({ list, setEventId }) {
  return (
    <div className="mt-5">
      <h3 className="text-center">Your Events</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.time}</td>
              <td>
                <button className="btn btn-warning">Edit</button>

                <button className="btn btn-danger mt-1">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default EventTable;
