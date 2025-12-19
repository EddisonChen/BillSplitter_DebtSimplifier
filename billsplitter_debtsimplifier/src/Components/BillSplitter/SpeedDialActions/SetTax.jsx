import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";

const SetTax = ({showModal, toggleModal, setTaxInput, setTaxInputType, taxInput, taxInputType}) => {

    const [tempTaxInput, setTempTaxInput] = useState(taxInput);
    const [tempTaxInputType, setTempTaxInputType] = useState(taxInputType);

    const handleTaxInput = (event) => {
        setTempTaxInput(event.target.value);
    }

    const handleTaxInputTypeSwitch = (event) => {
        setTempTaxInputType(event.target.value);
    }

    const handleSubmitTax = () => {
        setTaxInput(Number(tempTaxInput));
        setTaxInputType(tempTaxInputType);
    }

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
            
            <Box sx={style} className="modal-box">
                <FormControl>
                    <FormLabel>Set Tax</FormLabel>
                    <TextField type="number" placeholder="Tax" variant="outlined" size="small" onChange={handleTaxInput} value={tempTaxInput}></TextField>
                    <FormLabel>Tax Input Type</FormLabel>
                    <RadioGroup defaultValue={taxInputType} name="tax-input-type-radio-group">
                        <FormControlLabel type="radio" name="Tax Input Type" value="percentage" control={<Radio/>} onChange={handleTaxInputTypeSwitch} label="Percentage"/>
                        <FormControlLabel type="radio" name="Tax Input Type" value="amount" control={<Radio/>} onChange={handleTaxInputTypeSwitch} label="Dollar Amount"/>
                    </RadioGroup>
                    <Button type="submit" onClick={(()=> {
                        handleSubmitTax();
                        toggleModal();
                    })} variant="outlined" endIcon={<AddIcon/>}>Submit</Button>           
                </FormControl>
            </Box>

        </Modal>
    )
}

export default SetTax;