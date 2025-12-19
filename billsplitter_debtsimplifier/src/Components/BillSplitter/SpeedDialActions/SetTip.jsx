import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from '@mui/icons-material/Add';
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import { useState, useEffect } from "react";

const SetTip = ({showModal, toggleModal, setTipInput, tipAfterTax, setTipAfterTax, tipInput}) => {

    const [tempTipInput, setTempTipInput] = useState(tipInput);
    const [tempTipAfterTax, setTempTipAfterTax] = useState(tipAfterTax);

    const handleTipAfterTax = () => {
        setTempTipAfterTax(!tipAfterTax);
    }

    const handleTipInput = (event) => {
        setTempTipInput(event.target.value);
    }

    const handleSubmitTip = () => {
        setTipInput(Number(tempTipInput/100));
        setTipAfterTax(tempTipAfterTax);
    }

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
                <FormControl>
                    <FormLabel>Set Tip %</FormLabel>
                    <TextField type="number" placeholder="Tip %" variant="outlined" size="small" value={tempTipInput} onChange={handleTipInput}></TextField>
                    <FormControlLabel control={<Checkbox/>} onChange={handleTipAfterTax} label="Tip Applied After Tax?" checked={tempTipAfterTax}/>
                    <Button type="submit" onClick={(() => {
                        handleSubmitTip();
                        toggleModal();
                    })} variant="outlined" endIcon={<AddIcon/>}>Submit</Button>        
                </FormControl>
            </Box>
        </Modal>
    )
}

export default SetTip;