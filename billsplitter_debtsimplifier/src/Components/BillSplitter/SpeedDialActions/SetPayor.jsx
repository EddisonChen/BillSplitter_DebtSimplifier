import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const SetPayor = ({parties, showModal, toggleModal, setPayor}) => {

    const handlePayor = (event) => {
        setPayor(event.target.value);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            open={showModal}
            onClose={toggleModal}>
            <Box sx={style}>
                <Typography>
                    Who paid this bill?
                </Typography>
                <select onChange={(event) => {
                    handlePayor(event);
                    toggleModal();}} defaultValue="">
                <option disabled="disabled" value="">--Select Payor--</option>
                {parties.map((party) => (
                    <option value={party} key={party}>{party}</option>
                ))}
            </select>
            </Box>
        </Modal>
    )
}

export default SetPayor;