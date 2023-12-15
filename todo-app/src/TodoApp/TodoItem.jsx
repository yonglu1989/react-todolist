import { 
  ListItem, 
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  IconButton } from "@mui/material";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import dayjs from "dayjs";
import './TodoItem.css'

export default function TodoItem({id, title, date, status, handleUpdate, handleDialogue, priority, handleDetails}) {
    
    const handleToggle = () => {
      handleUpdate(id, "toggleStatus")
    }

    const handleDelete = () => {
      handleUpdate(id, "delete")
    }

    const handleEdit = () => {
      handleDialogue(true, "edit", id)
    }

    const handleOpenDetails = () => {
      handleDetails(true, id)
    }

    let priorityString = priority === 2 ? "low-priority" 
                                        :  priority === 1
                                        ? "medium-priority"
                                        : "high-priority"
    return(
        <ListItem
            className={"list-item" + " " + priorityString}
            key={id}
            secondaryAction={
              <>
                <button className={status === 1 ? "detail-button-completed" : "detail-button"} onClick={handleOpenDetails}>Details</button>
                <button className={status === 1 ? "date-style-completed" : "date-style"}>{dayjs(date).format('LL')}</button>
                <IconButton edge="end" className={status === 1 ? "completed-icon" : ""} aria-label="edit" sx={{p: 2}} onClick={handleEdit}>
                  <EditTwoToneIcon />
                </IconButton>
                <IconButton edge="end" className={status === 1 ? "completed-icon" : ""} aria-label="delete" sx={{p: 2}} onClick={handleDelete}>
                  <DeleteForeverTwoToneIcon />
                </IconButton>
              </>
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle} dense>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={status === 1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': title }}
                />
              </ListItemIcon>
              <ListItemText className={status === 1 ? "completed-text" : ""} primary={title} sx={{minWidth: '500px'}}/>
            </ListItemButton>
          </ListItem>
    )
}