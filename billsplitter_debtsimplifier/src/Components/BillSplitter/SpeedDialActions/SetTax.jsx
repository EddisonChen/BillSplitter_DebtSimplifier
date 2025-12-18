import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const SetTax = ({showModal, toggleModal, setTaxInput, setTaxInputType}) => {

    const handleTaxInput = (event) => {
        setTaxInput(Number(event.target.value));
    }

    const handleTaxInputTypeSwitch = (event) => {
        setTaxInputType(event.target.value);
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
                <Typography>
                    Set Tax
                </Typography>
                <form>
                    <input type="number" placeholder="Tax" onChange={handleTaxInput}></input>
                    <p>Tax Input Type</p>
                    <input type="radio" name="Tax Input Type" value="percentage" defaultChecked onChange={handleTaxInputTypeSwitch}></input><label>Percentage</label>
                    <input type="radio" name="Tax Input Type" value="amount" onChange={handleTaxInputTypeSwitch}></input><label>Dollar Amount</label>
                    <Button type="submit" onClick={toggleModal} variant="outlined">Submit</Button>           
                </form>
            </Box>

        </Modal>
    )
}

export default SetTax;