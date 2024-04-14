import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Navbar, Nav } from "react-bootstrap";
import fetchCsrfToken from "./utils/crsf";
import { useEffect } from "react";

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
        const response = await fetch("http://127.0.0.1:8000/messages/get-all-messages/");
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
    event.preventDefault();
    setError(null); 
    if (message.trim() === "") {
      setError("Message cannot be empty");
      return;
    }    
    const csrfToken = await fetchCsrfToken();

    const messageData = message;
    const contactData = contactInfo;
    const isPublicData = isPublic;
    if (isPublic) {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/messages/submit-message/",
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
          console.log("Message sent successfully!");
        } else {
          console.error("Error sending message:", response.status);
        }
      } catch (error) {
        console.error("Error sending message1:", error);
      }
    } else {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/messages/submit-message/",
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
          console.log("Message sent successfully!");
        } else {
          setError("Error sending message");
          console.error("Error sending message:", response.status);
        }
      } catch (error) {
        setError(`Error sending message. ${error}`);

        console.error("Error sending message1:", error);
      }
    }
  };

  return (
    <div><Navbar expand="lg" >
        
    <Container>
      <Navbar.Brand href="/">
        Leave a message/complaint for me.
      </Navbar.Brand>
      <Nav>{}</Nav>
      <Nav>logout</Nav>
    </Container>
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
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Col>
        <Col xs={12} md={6}>
          {/* Public comments go here */}
          {Array.isArray(comments) ? (
  comments.map((comment, index) => (
    <div key={index}>
      
      
      <h5>{comment.content}</h5>
      {/*add comment by userid and make the font smalle*/}
      <p style={{ fontSize: "smaller" }}>by: {comment.user_uuid}, at: {comment.created_at}</p>

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
