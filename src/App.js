import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import MessageForm from "./MessageForm";
import { Navbar, Container, Nav } from "react-bootstrap";

function App() {
  return (
    <div>
      <Navbar expand="lg">
        {" "}
        {/* Customize appearance as needed */}
        <Container>
          <Navbar.Brand href="/">
            Leave a message/complaint for me.
          </Navbar.Brand>
          <Nav>{/* Add navigation links here if needed */}</Nav>
        </Container>
      </Navbar>
      <MessageForm />
    </div>
  );
}

export default App;
