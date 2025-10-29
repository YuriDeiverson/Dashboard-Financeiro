import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

interface SummaryCardProps {
  title: string;
  value: string;
  type: "income" | "expense" | "balance";
  trend?: number;
}

const SummaryCardMui: React.FC<SummaryCardProps> = ({
  title,
  value,
  type,
  trend,
}) => {
  const getIcon = () => {
    switch (type) {
      case "income":
        return <TrendingUpIcon sx={{ color: "success.main", fontSize: 40 }} />;
      case "expense":
        return <TrendingDownIcon sx={{ color: "error.main", fontSize: 40 }} />;
      default:
        return (
          <AccountBalanceWalletIcon
            sx={{ color: "primary.main", fontSize: 40 }}
          />
        );
    }
  };

  const getColor = () => {
    switch (type) {
      case "income":
        return "success.main";
      case "expense":
        return "error.main";
      default:
        return "primary.main";
    }
  };

  return (
    <Card sx={{ minWidth: 275, height: "100%" }}>
      <CardContent>
        <div className="flex justify-between items-start">
          <div>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{ color: getColor(), fontWeight: "bold" }}
            >
              {value}
            </Typography>
            {trend !== undefined && (
              <Typography
                sx={{ fontSize: 14 }}
                color={trend >= 0 ? "success.main" : "error.main"}
              >
                {trend >= 0 ? "+" : ""}
                {trend}% em relação ao mês anterior
              </Typography>
            )}
          </div>
          {getIcon()}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCardMui;
