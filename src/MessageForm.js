import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

function MessageForm() {
  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const messageData = message;
    const contactData = contactInfo;
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/messages/submit-message/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageData,
            contactInfo: contactData,
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
  };

  return (
    <Container>
      <Row>
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
            <br />
            <Form.Group controlId="contactInfo">
              <Form.Label>Contact Info (Optional):</Form.Label>
              <Form.Control
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default MessageForm;
