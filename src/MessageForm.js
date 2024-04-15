import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Navbar, Nav } from "react-bootstrap";
import fetchCsrfToken from "./utils/crsf";
import { useEffect } from "react";
import { getCookie, setCookie } from "./utils/cookies";
import { v4 as uuidv4 } from "uuid";
import { baseUrl } from "./config.js";

/**
 * Represents a form for sending messages.
 *
 * @returns {JSX.Element} The rendered form component.
 */
function MessageForm() {
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    //fetch from cookie
    const user = getCookie("user_uuid");
    //if user is null then setCookie random uuid
    if (user === null) {
      const uuid = uuidv4();
      setCookie("user_uuid", uuid, 365);
      setUser(uuid);
    }
    else setUser(user);
  }
  , [user]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 5000);
  
      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeout);
    }
   
  }, [error]);

  
 
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${baseUrl}/messages/get-all-messages/`);
        const data = await response.json();
        setComments(data.comments);
       //print type of data
       
      }
      catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }
  , []);


  const handleSubmit = async (event) => {
    setSendingMessage(true);
    event.preventDefault();
    setError(null); 
    if (message.trim() === "") {
      setError("Message cannot be empty");
      setSendingMessage(false);
      return;
    }    
    const csrfToken = await fetchCsrfToken();

    const messageData = message;
    const contactData = contactInfo;
    const isPublicData = isPublic;
    if (isPublic) {
      try {
        const response = await fetch(
          `${baseUrl}/messages/submit-message/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({
              message: messageData,
              contactInfo: contactData,
              isPublic: isPublicData,
              user_uuid: user,
            }),
          },
        );
        if (response.ok) {
          console.log("Message sent successfully!");
          setMessage("");
        } else {
          console.error("Error sending message:", response.status);
        }
      } catch (error) {
        console.error("Error sending message1:", error);
      }
    } else {
      try {
        const response = await fetch(
          `${baseUrl}/messages/submit-message/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({
              message: messageData,
              contactInfo: contactData,
              isPublic: isPublicData,
            }),
          },
        );
        if (response.ok) {
          const jsonResponse = await response.json();
          if(jsonResponse.success){
            console.log("Message sent successfully!");
            setMessage("");
            setContactInfo("");
            window.location.reload();
          } else {
            setError(jsonResponse.error);
            console.error("Error sending message:", jsonResponse.error);
          }
          

        } else {
          setError("Error sending message");
          console.error("Error sending message:", response.status);
        }
      } catch (error) {
        setError(`Error sending message. ${error}`);

        console.error("Error sending message1:", error);
      }
    }
    
    setSendingMessage(false);
  };

  const handleLogout = async () => {
    setCookie("user_uuid", "", 0);
    setUser(null);
  };


  return (
    <div>
      <Navbar expand ="lg" sticky="top" expanded>
 <Container><Navbar.Brand href="/">Leave a message/complaint for me.</Navbar.Brand>

  <Nav className="mr-auto">
    <Nav.Item>User: {user}</Nav.Item>
  </Nav>
  <Nav>
    <Nav.Link onClick={handleLogout}>Reset user</Nav.Link>
  </Nav></Container>
</Navbar>
  <Container>
      <Row>
        {error && <p className="text-danger">{error}</p>}
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="message">
              <Form.Label>Message:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            {!isPublic && (
              <>
                <br />
                <Form.Group controlId="contactInfo">
                  <Form.Label>Contact Info (Optional):</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
            <br />

            <Form.Group controlId="isPublic">
              <Form.Check
                type="checkbox"
                label="Make Message Public"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
            </Form.Group>

            <br />
            <Button variant="primary" type="submit" disabled={sendingMessage === true}>
              Send Message
            </Button>
          </Form>
        </Col>
        <Col xs={12} md={6}>
          {Array.isArray(comments) ? (
  comments.map((comment, index) => (
    <div key={index}>
      
      
      <h5>{comment.content}</h5>
      <p style={{ fontSize: "smaller" }}>by: {comment.user_uuid===user? 'You': comment.user_uuid}, at: {comment.created_at}</p>

    </div>
  ))
) : (
  <p>No comments available</p>
)}
        </Col>
      </Row>
    </Container></div>
    
   
  );
}

export default MessageForm;
