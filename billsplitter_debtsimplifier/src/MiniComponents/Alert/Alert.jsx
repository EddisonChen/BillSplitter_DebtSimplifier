import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

const WarningAlert = ({ message }) => {
    const [show, setShow] = useState(true);

    if (show) {
        return (
            <Alert variant="warning" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                {message}
                </p>
            </Alert>
        )
    }
 
};

export default WarningAlert;