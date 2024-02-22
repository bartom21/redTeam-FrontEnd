import React, { useState } from "react"
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import PaidIcon from '@mui/icons-material/Paid';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Logout from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import { Link, useHistory } from "react-router-dom"
import DiscountIcon from '@mui/icons-material/Discount';
import { auth } from "../firebase"
import {
    signOut
  } from "firebase/auth";
import { MenuList } from "@mui/material";
import { useDispatch } from "react-redux";
import { userLogout } from "../store/actions/userLogout";

export default function BarMenu(props) {
    const [error, setError] = useState("")
    const history = useHistory()
    const dispatch = useDispatch()

    const logout = () => signOut(auth);

    async function handleLogout() {
        setError("")

        try {
        await logout()
        dispatch(userLogout())
        history.push("/")
        } catch {
        setError("Error al cerrar sesión")
        }
    }

    function handleAdminUsers() {
        history.push("/usuarios")
    }

    function handleCobros() {
      history.push("/cobros")
    }

    function handleRates() {
      history.push("/tarifas")
    }

    function handleRewards() {
      history.push("/bonus")
    }

    var items = (<MenuList>
        <MenuItem>
          <Avatar /> Perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
        </MenuList>)

    if(props.role === 'admin'){
        items = (<MenuList>
            <MenuItem>
              <Avatar /> Perfil
            </MenuItem>
            <MenuItem onClick={handleAdminUsers}>
              <ListItemIcon>
                <GroupIcon fontSize="small" />
              </ListItemIcon>
              Administar Usuarios
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleRates}>
              <ListItemIcon>
                <PaidIcon fontSize="small" />
              </ListItemIcon>
              Administrar Tarifas
            </MenuItem>
            <MenuItem onClick={handleRewards}>
              <ListItemIcon>
                <DiscountIcon fontSize="small" />
              </ListItemIcon>
              Administrar Bonus
            </MenuItem>
            <MenuItem onClick={handleCobros}>
              <ListItemIcon>
                <ReceiptIcon fontSize="small" />
              </ListItemIcon>
              Registro de Cobros
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Configuración
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
        </MenuList>)
    }

  return (
      <Menu
        anchorEl={props.anchorEl}
        id="account-menu"
        open={props.open}
        onClose={props.handleClose}
        onClick={props.handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {items}
      </Menu>
  );
}
