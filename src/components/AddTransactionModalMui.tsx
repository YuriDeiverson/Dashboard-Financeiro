import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { Transaction } from "../utils/types";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, "id" | "industry">) => void;
}

const AddTransactionModalMui: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      date: new Date(date).toISOString(),
      status: "completed",
      account: "Principal",
      method: "PIX",
      category: "Outros",
    });
    setDescription("");
    setAmount("");
    setType("expense");
    setDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Transação</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Valor"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={type}
                label="Tipo"
                onChange={(e) =>
                  setType(e.target.value as "income" | "expense")
                }
              >
                <MenuItem value="expense">Despesa</MenuItem>
                <MenuItem value="income">Receita</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Data"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTransactionModalMui;
