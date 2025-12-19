import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const SetPayor = ({parties, showModal, toggleModal, setPayor, payor}) => {

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
                <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
                    <FormLabel>Who paid this bill?</FormLabel>
                    <Select autowidth="true" defaultValue={payor || ""} onChange={(event) => {
                        handlePayor(event);
                        toggleModal();}}>
                        {parties.map((party) => (
                            <MenuItem value={party} key={party}>{party}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
               
            </Box>
        </Modal>
    )
}

export default SetPayor;