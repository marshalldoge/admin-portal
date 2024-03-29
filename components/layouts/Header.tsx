import React, {useEffect, useState} from "react";
import styles from '../../styles/layouts/Header.module.scss';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import App from "next/app";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {RootState} from "../../redux/store";
import {setLayout} from "../../redux/actions";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {alpha, FormControl, InputBase, InputLabel, Select} from "@mui/material";
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {useRouter} from "next/router";
import Box from '@mui/material/Box';
import {logout} from "../../services/auth";
import {getList} from "../../services/listService";
import {ACTIVITY_TYPE_LIST} from "../../constants/lists";

type headerProps = {

};

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: '50%',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Header: React.FunctionComponent<headerProps> = ({}) => {
	const dispatch = useAppDispatch();
	const layout = useAppSelector((state: RootState) => state.layout);
	const list = useAppSelector((state: RootState) => state.list);
	const theme = useTheme();
	const router = useRouter();
	const [open, setOpen] = React.useState(false);

	const showHeader = router.pathname !== "/login" && router.pathname !== "/" ? false : true;

	useEffect(() => {
		dispatch(getList(ACTIVITY_TYPE_LIST));
	},[])

	const handleDrawerOpen = () => {
		dispatch(setLayout({drawerExpanded: true}));
	};

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
		React.useState<null | HTMLElement>(null);

	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMobileMenuClose = () => {
		setMobileMoreAnchorEl(null);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		handleMobileMenuClose();
	};

	const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setMobileMoreAnchorEl(event.currentTarget);
	};

	const handleLogout = async () => {
		await dispatch(logout());
		router.push("/login");
	}

	const handleActivityChange = (e:any) => {
		dispatch(setLayout({activity: e.target.value }))
	}

	const ActivitySelector = () => {
		let activities = list[ACTIVITY_TYPE_LIST.name].map((activity:any, idx:number) => {
			return <MenuItem key={`activity-selector-${idx}`} value={activity.id}>{activity.name}</MenuItem>;
		})
		activities = [<MenuItem key={`activity-selector-${-1}`} value={-1}>Todos</MenuItem>, ...activities];
		return (
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={layout.activity}
				onChange={handleActivityChange}
				variant={'outlined'}
				style={{
					backgroundColor: 'white',
					width: '200px',
				}}
				size={'small'}
			>
				{activities}
			</Select>
		)
	}

	const menuId = 'primary-search-account-menu';
	const renderMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={() => {dispatch(setLayout({theme: 'dark'}))}}>Cambiar tema</MenuItem>
			<MenuItem onClick={handleMenuClose}>Mi perfil</MenuItem>
			<MenuItem onClick={handleMenuClose}>Mi cuenta</MenuItem>
			<MenuItem onClick={() => {handleMenuClose();handleLogout();}}>Salir</MenuItem>
		</Menu>
	);

	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={mobileMenuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMobileMenuOpen}
			onClose={handleMobileMenuClose}
		>
			<MenuItem>
				<p>Messages</p>
			</MenuItem>
			<MenuItem>
				<IconButton size="large" aria-label="show 4 new mails" color="inherit">
					<Badge badgeContent={4} color="error">
						<MailIcon />
					</Badge>
				</IconButton>
				<p>Messages</p>
			</MenuItem>
			<MenuItem>
				<IconButton
					size="large"
					aria-label="show 17 new notifications"
					color="inherit"
				>
					<Badge badgeContent={100} color="error">
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="primary-search-account-menu"
					aria-haspopup="true"
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	);

	if(showHeader) return null;

	return (
		<AppBar position="fixed" open={layout.drawerExpanded}>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					edge="start"
					sx={{
						marginRight: '36px',
						...(layout.drawerExpanded && { display: 'none' }),
					}}
				>
					<MenuIcon />
				</IconButton>
				<Search>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="Buscar…"
						inputProps={{ 'aria-label': 'search' }}
					/>
				</Search>
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
					<FormControl fullWidth>
						{ActivitySelector()}
					</FormControl>
					<IconButton size="large" aria-label="show 4 new mails" color="inherit">
						<Badge badgeContent={4} color="error">
							<MailIcon />
						</Badge>
					</IconButton>
					<IconButton
						size="large"
						aria-label="show 17 new notifications"
						color="inherit"
					>
						<Badge badgeContent={17} color="error">
							<NotificationsIcon />
						</Badge>
					</IconButton>
					<IconButton
						size="large"
						edge="end"
						aria-label="account of current user"
						aria-controls={menuId}
						aria-haspopup="true"
						onClick={handleProfileMenuOpen}
						color="inherit"
					>
						<AccountCircle />
					</IconButton>
				</Box>
				<Box sx={{ display: { xs: 'flex', md: 'none' } }}>
					<IconButton
						size="large"
						aria-label="show more"
						aria-controls={mobileMenuId}
						aria-haspopup="true"
						onClick={handleMobileMenuOpen}
						color="inherit"
					>
						<MoreIcon />
					</IconButton>
				</Box>
			</Toolbar>
			{renderMobileMenu}
			{renderMenu}
		</AppBar>
	);
}
export default Header;
