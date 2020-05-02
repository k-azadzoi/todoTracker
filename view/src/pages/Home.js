import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { authMiddleWare } from '../util/auth'
import Account from '../components/Account';
import Todo from '../components/Todo';
import {Drawer, AppBar, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText, Avatar, CircularProgress } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import NotesIcon from '@material-ui/icons/Notes';
import withStyles from '@material-ui/core/styles/withStyles';

const Home = (props) => {
    const [render, setRender] = useState({
        render: false
    })

    const [authUser, setAuthUser] = useState({
        firstName: '',
        lastName: '',
        profilePicture: '',
        uiLoading: true,
        imageLoading: false
    })

    const loadAccountPage = (event) => {
        setRender({
            render: true
        })
    }

    const loadTodoPage = (event) => {
        setRender({
            render: false
        })
    }

    const logoutHandler = (event) => {
        localStorage.removeItem('AuthToken')
        props.history.push('/login')
    }

    useEffect(() => {
        authMiddleWare(props.history)
        const authToken = localStorage.getItem('AuthToken')
        axios.defaults.headers.common = { Authorization: `${authToken}`}
        axios.get('/user').then((response) => {
            console.log(response.data)
            setAuthUser({
                firstName: response.data.userCredentials.firstName,
                lastName: response.data.userCredentials.lastName,
                email: response.data.userCredentials.email,
                username: response.data.userCredentials.username,
                profilePicture: response.data.userCredentials.imageUrl,
                uiLoading: false,
            })
        })
        .catch((error) => {
            if(error.response.status === 400) {
                props.history.push('/login')
            }
            console.log(error)
            setAuthUser({ errorMsg: 'Error in getting the data' })
        })
    }, [props.history])

    const { classes } = props;	
		if (authUser.uiLoading === true) {
			return (
				<div className={classes.root}>
					{authUser.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</div>
			);
	} else {
    return(
        <div className={classes.root}>
					<CssBaseline />
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<Typography variant="h6" noWrap>
								Todo Tracker 
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
                        anchor='left'
						className={classes.drawer}
						variant="permanent"
						classes={{
							paper: classes.drawerPaper
						}}
					>
						<div className={classes.toolbar} />
						<Divider />
						<center>
							<Avatar src={authUser.profilePicture} className={classes.avatar} />
							<p>
								{' '}
								{authUser.firstName} {authUser.lastName}
							</p>
						</center>
						<Divider />
						<List>
							<ListItem button key="Todo" onClick={loadTodoPage}>
								<ListItemIcon>
									{' '}
									<NotesIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Todo" />
							</ListItem>

							<ListItem button key="Account" onClick={loadAccountPage}>
								<ListItemIcon>
									{' '}
									<AccountBoxIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Account" />
							</ListItem>

							<ListItem button key="Logout" onClick={logoutHandler}>
								<ListItemIcon>
									{' '}
									<ExitToAppIcon />{' '}
								</ListItemIcon>
								<ListItemText primary="Logout" />
							</ListItem>
						</List>
					</Drawer>

					<div>{render.render ? <Account /> : <Todo />}</div>
				</div>
    )
    }
}
const drawerWidth = 240

const styles = (theme) => ({
	root: {
        display: 'flex',
        flexWrap: 'wrap'
	},
	appBar: {
        zIndex: theme.zIndex.drawer + 1,
        position: 'fixed',
        backgroundColor: '#039be5'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#f5f5f5'
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	avatar: {
		height: 110,
		width: 100,
		flexShrink: 0,
        flexGrow: 0,
        marginTop: 20,
        marginBottom: 20
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	toolbar: theme.mixins.toolbar
});

export default withStyles(styles)(Home)