import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, Divider, Select, MenuItem, InputLabel } from '@mui/material';
import { DatePicker} from '@mui/x-date-pickers';
import { Fragment, useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

export default function FormDialog({dialog, setDialog, handleUpdate}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: 2,
    date: dayjs(Date.now())
  })

  useEffect(()=> {
    setForm({
      title: dialog.todo ? dialog.todo.title : "",
      description: dialog.todo ? dialog.todo.description : "",
      priority: dialog.todo ? dialog.todo.priority : 2,
      date: dialog.todo ? dayjs(dialog.todo.date) : dayjs(Date.now())      
    })
  }, [dialog])

  const handleClose = () => {
    setDialog({
      ...dialog,
      open: false
    });
  };

  const handleChange = (e) => {
    if(dayjs.isDayjs(e)){
      setForm({
        ...form,
        date: e
      })
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit = () => {
    if(dialog.action==="add") {
      handleUpdate(-1, "POST", form)
    } else if(dialog.action === "edit") {
      handleUpdate(dialog.todo.id, "edit", form)
    }
  }

  return (
    <Fragment>
      <Dialog open={dialog.open} onClose={handleClose}>
        <DialogTitle>{dialog.action === "add" ? "Add New Todo" : "Edit Todo"}</DialogTitle>
        <Divider/>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
              <FormControl sx={{ minWidth: 300 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  name="title"
                  label="Title"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl sx={{ mt: 2, minWidth: 300 }}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="description"
                  name="description"
                  label="Description of Todo"
                  value={form.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </FormControl>
              <div style={{display: 'flex', gap:'20px'}}>
                <FormControl sx={{ mt: 2, minWidth: 250 }}>
                    <InputLabel id="priority-selector-label">Priority</InputLabel>
                    <Select
                      labelId="priority-selector-label"
                      id="priority-selector"
                      name="priority"
                      value={form.priority}
                      autoWidth
                      label="priority"
                      onChange={handleChange}
                    >
                      <MenuItem value={2}>Low</MenuItem>
                      <MenuItem value={1}>Medium</MenuItem>
                      <MenuItem value={0}>High</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ mt: 2, minWidth: 250 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Controlled picker"
                      value={form.date}
                      name="date"
                      onChange={handleChange}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

          </Box>
        </DialogContent>
        <Divider/>
        <DialogActions>
          <Button onClick={handleSubmit}>{dialog.action === "add" ? "Add" : "Save Edit"}</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}