import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { User } from "../utils/types";

interface HeaderProps {
  user: User | null;
  toggleSidebar: () => void;
  accountsOptions: string[];
  statesOptions: string[];
}

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "white", color: "black" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard Financeiro
        </Typography>

        {user && (
          <div className="flex items-center gap-2">
            <AccountCircleIcon />
            <Typography variant="subtitle1">{user.name}</Typography>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
