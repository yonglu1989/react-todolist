import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText, Divider} from '@mui/material';
import { Fragment} from 'react';

export default function DetailsDialog({openDetails, setOpenDetails}) {
    const handleClose = () => {
        setOpenDetails({
            open: false,
            todo: null
        })
    }

    return (
        <Fragment>
        <Dialog sx={{minWidth: '200px'}}open={openDetails.open}>
            <DialogTitle>{openDetails.todo?.title}</DialogTitle>
            <Divider/>
            <DialogContent sx={{minWidth: '400px'}}>
                <DialogContentText>{openDetails.todo?.description}</DialogContentText>
            </DialogContent>
            <Divider/>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </Fragment>
    );
}