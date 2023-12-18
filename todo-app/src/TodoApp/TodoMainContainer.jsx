import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import {
    Box, AppBar, Toolbar, Typography, Drawer,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Divider, Fab
} from "@mui/material"
import TextSnippetSharpIcon from '@mui/icons-material/TextSnippetSharp';
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import FormDialog from "./FormDialog";
import DetailsDialog from "./DetailsDialog";
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import TodoItem from "./TodoItem";
import dayjs from 'dayjs';
import {v4 as uuid} from 'uuid'
import useAxios from './hooks/useAxios'

export default function TodoMainContainer() {
    const [data, setData] = useState([])
    const [filter, setFilter] = useState("")
    const [pageNum, setPageNum] = useState(1)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const {
        isLoading,
        isError,
        error,
        results,
        hasNextPage
    } = useAxios(pageNum)
    const [dialog, setDialog] = useState({
        open: false,
        action: "None",
        todo: null
    })
    const [openDetails, setOpenDetails] = useState({
        open: false,
        todo: null
    })

    const intObserver = useRef()
    const lastPostRef = useCallback(post => {
        if (isLoading) return

        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                console.log('We are near the last post!')
                setPageNum(prev => prev + 1)
            }
        })

        if (post) intObserver.current.observe(post)
    }, [isLoading, hasNextPage])

    const filterProps = (value) => ({
        selected: selectedIndex === value,
        onClick: () => setSelectedIndex(value)
    })

    useEffect(()=> {
        let todayStart = dayjs().startOf('d').toISOString()
        let todayEnd = dayjs().endOf('d').toISOString()
        let wStart = dayjs().startOf('w').toISOString()
        let wEnd = dayjs().endOf('w').toISOString()
        switch(selectedIndex) {
            case 0:
                setFilter("")
                break
            case 1:
                setFilter("&status=0")
                break
            case 2:
                setFilter("&status=1")
                break
            case 3:
                setFilter(`&date_lte=${todayEnd}&date_gte=${todayStart}`)
                break
            case 4:
                setFilter(`&date_lte=${wEnd}&date_gte=${wStart}`)
                break
            case 5:
                setFilter(`&date_lte=${todayStart}&status=0`)
                break
            default:
                break
            
        }
    }, [selectedIndex])

    const getData = () => {
        axios.get(`http://localhost:3000/todos?${filter}`)
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }

    useEffect(()=> {
        getData()
    }, [filter])

    const deleteTodo = (id) => {
        axios.delete(`http://localhost:3000/todos/${id}`)
        .then((res)=>{
            getData()
        })
        .catch(err=>console.log(err))
    }

    const toggleStatus = (id) => {
        let todo = data.find((todo) => todo.id === id)
        let status = todo.status ? 0 : 1
        axios.put('http://localhost:3000/todos/'+id, {
            ...todo,
            status: status
        })
        .then((res)=>{
            getData()
        })
        .catch(err=>console.log(err))
    }

    const handlePost = (todo) => {
        let newId = uuid()
        axios.post(`http://localhost:3000/todos`, {
            id: newId,
            title: todo.title,
            description: todo.description,
            priority: todo.priority,
            date: todo.date,
            status: 0
        }).then((res)=>{
            getData()
            handleDialogue(false)
        })
        .catch(err=>console.log(err))
    }

    const handleEdit = (id, form) => {
        let status = data.find((todo) => todo.id === id).status
        axios.put('http://localhost:3000/todos/'+id, {
            id: id,
            title: form.title,
            description: form.description,
            priority: form.priority,
            date: form.date,
            status: status,
        })
        .then((res)=>{
            getData()
            handleDialogue(false)
        })
        .catch(err=>console.log(err))
    }

    const handleUpdate = (id, action, form={}) => {
        if(action === "delete") {
            deleteTodo(id)
        } else if(action === "toggleStatus") {
            toggleStatus(id)
        } else if(action === "POST") {
            handlePost(form)
        } else if(action === "edit") {
            handleEdit(id, form)
        } 
    }

    const handleDialogue = (open, action="none", id=null) => {
        let todo = id ? data.find((todo) => todo.id === id) : null
        setDialog({
            ...dialog,
            open: open,
            action: action,
            todo: todo
        })
    }

    const handleDetails = (open, id=null) => {
        let todo = id ? data.find((todo) => todo.id === id) : null
        setOpenDetails({
            open: open,
            todo: todo
        })
    }

    return (
        <Fragment>
                <Box sx={{display: 'flex'}}>
                    <CssBaseline/>
                    <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#093c6f' }}>
                        <Toolbar>
                            <TextSnippetSharpIcon sx={{ mr: 2 }}/>
                            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                                Todo List
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    
                    <Drawer sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box',
                        },
                        }}
                        variant="permanent"
                    >
                        <Toolbar />
                        <Box sx={{ overflow: "auto" }}>
                            <List>
                                {["All Todos", "Active", "Completed", "Due Today", "This Week", "Overdue"].map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton {...filterProps(index)}>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                                ))}
                            </List>

                            <FormDialog dialog={dialog} setDialog={setDialog} handleUpdate={handleUpdate}></FormDialog>
                            <DetailsDialog openDetails={openDetails} setOpenDetails={setOpenDetails}></DetailsDialog>
                            <Fab onClick={()=>handleDialogue(true, "add")} color="primary" aria-label="add" sx={{position: "absolute", padding: '4px', bottom: '16px', left: '16px'}}>
                                <AddIcon />
                            </Fab>
                        </Box>
                    </Drawer>

                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Toolbar />
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {results.map((item, i)=> {
                                    if (results.length === i+1) {
                                        return (
                                            <TodoItem
                                            ref={lastPostRef}
                                            key={item.id} 
                                            id={item.id} 
                                            title={item.title} 
                                            desc={item.description}
                                            date={item.date} 
                                            status={item.status}
                                            priority={item.priority}
                                            handleUpdate={handleUpdate}
                                            handleDialogue={handleDialogue}
                                            handleDetails={handleDetails}
                                        />
                                        )
                                    }
                                    return(
                                        <TodoItem
                                            key={item.id} 
                                            id={item.id} 
                                            title={item.title} 
                                            desc={item.description}
                                            date={item.date} 
                                            status={item.status}
                                            priority={item.priority}
                                            handleUpdate={handleUpdate}
                                            handleDialogue={handleDialogue}
                                            handleDetails={handleDetails}
                                        />
                                    )   
                                })}
                        </List>
                    </Box>
                </Box>
        </Fragment>
    )
}