import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';

const SummaryView = ({itemsWithCalculations, taxInput, taxInputType, tipInput, tipAfterTax, payor}) => {

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
                const calculatedTaxPercentage = parseFloat((sumTaxAmount/sumTaxableItems).toFixed(1));
                setTaxDisplay(`${calculatedTaxPercentage}%, $${parseFloat(taxInput.toFixed(2))}`);
            }

            setTipDisplay(`${parseFloat((tipInput*100).toFixed(1))}%, $${parseFloat(sumTipAmount.toFixed(2))}`);

            setFinalPriceDisplay(`$${parseFloat(sumFinalPrice.toFixed(2))}`);
        }

        performCalculations()
    }, [itemsWithCalculations, taxInput, taxInputType, tipInput, tipAfterTax]);

return (
    <div>
        <h3>Bill Summary</h3>
        <TableContainer component={Paper}>
            <Table aria-label="summary of costs table">
                <TableBody>
                    <TableRow>
                        <TableCell align="left">Total Base Cost:</TableCell>
                        <TableCell align="left">{totalBaseCostDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Tax %, Amount:</TableCell>
                        <TableCell align="left">{taxDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Tip %, Amount:</TableCell>
                        <TableCell align="left">{tipDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Final Price:</TableCell>
                        <TableCell align="left">{finalPriceDisplay}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Payor:</TableCell>
                        <TableCell align="left">{payor}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </div>
)
}

export default SummaryView;