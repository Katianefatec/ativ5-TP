const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get('/clientes', async (req, res) => {
  const clientes = await prisma.cliente.findMany();
  res.json(clientes);
});

app.post('/clientes', async (req, res) => {
  const novoCliente = await prisma.cliente.create({
    data: req.body,
  });
  res.json(novoCliente);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});