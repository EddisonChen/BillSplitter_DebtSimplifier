import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const SetTip = ({showModal, toggleModal, setTipInput, tipAfterTax, setTipAfterTax}) => {

    const handleTipAfterTax = () => {
        setTipAfterTax(!tipAfterTax);
    }

    const handleTipInput = (event) => {
        setTipInput(Number(event.target.value)/100);
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
                <div>
                    <input type="number" placeholder="Tip %" onChange={handleTipInput}></input>
                    <input type="checkbox" onChange={handleTipAfterTax}></input><label>Tip After Tax?</label>
                    <Button type="submit" onClick={toggleModal} variant="outlined">Submit</Button>        
                </div>
            </Box>

        </Modal>
    )
}

export default SetTip;