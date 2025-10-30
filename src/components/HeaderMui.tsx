import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { User } from "../utils/types";

interface HeaderProps {
  user: User | null;
  toggleSidebar: () => void;
  accountsOptions: string[];
  statesOptions: string[];
}

const Header: React.FC<HeaderProps> = ({ user, toggleSidebar }) => {
  // Função para gerar as iniciais do email
  const getInitialsFromEmail = (email: string): string => {
    if (!email) return "U";
    const emailPart = email.split("@")[0];
    const parts = emailPart.split(/[._-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return emailPart.substring(0, 2).toUpperCase();
  };
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
            <Avatar sx={{ bgcolor: "#10b981", width: 32, height: 32, fontSize: "0.875rem" }}>
              {user.email ? getInitialsFromEmail(user.email) : "U"}
            </Avatar>
            <Typography variant="subtitle1">{user.name}</Typography>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
