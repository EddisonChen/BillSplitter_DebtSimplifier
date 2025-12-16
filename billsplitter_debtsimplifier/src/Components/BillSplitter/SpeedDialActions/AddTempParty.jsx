import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MuiAlert from "../../../MiniComponents/MuiAlert/MuiAlert";

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
                    Add Party
                </Typography>
                 <form>
                    <input type="text" placeholder="Party Name" value={partyInput} onChange={handlePartyInputChange}></input>
                    <Button type="submit" onClick={addTempParty}>Add Party</Button>
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