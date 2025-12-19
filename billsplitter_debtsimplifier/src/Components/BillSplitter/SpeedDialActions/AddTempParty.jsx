import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MuiAlert from "../../../MiniComponents/MuiAlert/MuiAlert";
import IconButton from '@mui/material/IconButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AddTempParty = ({showModal, toggleModal, tempParties, partyInput, setPartyInput, setTempParties}) => {

    const [warning, setWarning] = useState();

    const handlePartyInputChange = (event) => {
        setPartyInput(event.target.value);
    };

    const addTempParty = (event) => {
        event.preventDefault();
        if (partyInput.length > 0) {
            if (!tempParties.includes(partyInput)) {
                setTempParties(tempParties => [...tempParties, partyInput]);
                setWarning();
            } else {
                setWarning("Party cannot have the same name as an existing party");
            }
            
        }
        setPartyInput("");
    };

   const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '65%',
        bgcolor: 'background.paper',
        borderRadius: "15px",
        boxShadow: 24,
        p: 4,
        overflowY: 'auto',
        maxHeight: '85vh'
    };

    return (
        <Modal
            open={showModal}
            onClose={toggleModal}>
            
            <Box sx={style}>
                <Typography>
                    Add Party
                </Typography>
                 <form>
                    <input type="text" placeholder="Party Name" value={partyInput} onChange={handlePartyInputChange}></input>
                    <IconButton type="submit" onClick={addTempParty}><PersonAddIcon/></IconButton>
                </form>
                <ol>
                    {tempParties.map(party => (
                        <li key={party}>{party}</li>
                    ))}
                </ol>
                {warning && <MuiAlert
                    severity={"warning"}
                    message={warning}></MuiAlert>}
            </Box>

        </Modal>
    )
}

export default AddTempParty;