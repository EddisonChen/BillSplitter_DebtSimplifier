import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const MuiAlert = ({ severity, title, message, }) => {

    return (
        <Alert severity={severity}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
        </Alert>
    )
}

export default MuiAlert;