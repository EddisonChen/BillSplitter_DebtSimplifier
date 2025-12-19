import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import IconButton from '@mui/material/IconButton';

const SummaryView = ({itemsWithCalculations, taxInput, taxInputType, tipInput, tipAfterTax, payor, parties, handleShowAddPartyModal}) => {

    const [totalBaseCostDisplay, setTotalBaseCostDisplay] = useState();
    const [taxDisplay, setTaxDisplay] = useState();
    const [tipDisplay, setTipDisplay] = useState();
    const [finalPriceDisplay, setFinalPriceDisplay] = useState();

    useEffect(() => {
        const performCalculations = () => {
            let sumBaseCost = 0;
            let sumTaxAmount = 0;
            let sumTaxableItems = 0;
            let sumTipAmount = 0;
            let sumFinalPrice = 0;

            for (let i=0; i<itemsWithCalculations.length; i++) {

                sumBaseCost += itemsWithCalculations[i].itemCost;

                if (itemsWithCalculations[i].taxExempt === false) {
                    sumTaxAmount += itemsWithCalculations[i].taxAmount;
                    sumTaxableItems += itemsWithCalculations[i].itemCost;
                }
        
                if (tipAfterTax) {
                    sumTipAmount += tipInput*(itemsWithCalculations[i].itemCost + itemsWithCalculations[i].taxAmount);
                } else{
                    sumTipAmount += tipInput*itemsWithCalculations[i].itemCost;
                }

                sumFinalPrice += itemsWithCalculations[i].totalCost;

            }

            setTotalBaseCostDisplay(`$${parseFloat(sumBaseCost.toFixed(2))}`);

            if (taxInputType === "percentage") {
                setTaxDisplay(`${parseFloat(taxInput.toFixed(1))}%, $${parseFloat(sumTaxAmount.toFixed(2))}`);
            } else {
                const calculatedTaxPercentage = parseFloat(((sumTaxAmount/sumTaxableItems)*100).toFixed(1));
                setTaxDisplay(`${Number.isFinite(calculatedTaxPercentage) ? calculatedTaxPercentage : 0}%, $${parseFloat(taxInput.toFixed(2))}`);
            }

            setTipDisplay(`${parseFloat((tipInput*100).toFixed(1))}%, $${parseFloat(sumTipAmount.toFixed(2))}`);

            setFinalPriceDisplay(`$${parseFloat(sumFinalPrice.toFixed(2))}`);
        }

        performCalculations()
    }, [itemsWithCalculations, taxInput, taxInputType, tipInput, tipAfterTax]);

return (
    <div>
        <div className="tab-header">
            <h3 className="head">Bill Summary</h3>
            {parties === undefined && 
                <Button aria-label="add party" variant="contained" size="medium" onClick={handleShowAddPartyModal} endIcon={<PersonAddIcon/>}
                    sx={{margin: "12px 0px 12px 0px"}}
                >Add Party</Button>}
        </div>
        <TableContainer component={Paper}>
            <Table aria-label="summary of costs table" sx={{
                    tableLayout: 'fixed',
                    width: '100%',
                }}>
                <TableBody>
                    <TableRow>
                        <TableCell align="left" className="table-header">Total Base Cost:</TableCell>
                        <TableCell align="left" className="table-info">{totalBaseCostDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left" className="table-header">Tax %, Amount:</TableCell>
                        <TableCell align="left" className="table-info">{taxDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left" className="table-header">Tip %, Amount:</TableCell>
                        <TableCell align="left" className="table-info">{tipDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left" className="table-header">Final Price:</TableCell>
                        <TableCell align="left" className="table-info">{finalPriceDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left" className="table-header">Payor:</TableCell>
                        <TableCell align="left" className="table-info">{payor}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
)
}

export default SummaryView;