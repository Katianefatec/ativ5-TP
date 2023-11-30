const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const helmet = require('helmet');

app.use(cors());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'http://localhost:3001'],
  }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/clientes', async (req, res) => {
  const clientes = await prisma.cliente.findMany();
  res.json(clientes);
});

app.get('/cliente/:id', async (req, res) => {
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(cliente);
});

app.delete('/cliente/excluir/:id', async (req, res) => {
  const cliente = await prisma.cliente.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(cliente);
});

app.post('/cliente/cadastrar', async (req, res) => {
  const { nome, nomeSocial, genero, dataCadastro, quantidadeConsumida, endereco, telefones } = req.body;

  try {
      const cliente = await prisma.cliente.create({
          data: {
              nome,
              nomeSocial,
              genero,
              dataCadastro,
              quantidadeConsumida,
              endereco: {
                  create: {
                      ...endereco,
                      codigoPostal: endereco.codigoPostal,
                  }
              },
              telefones: {
                  create: telefones
              }
          }
      });

      res.status(200).json(cliente);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ocorreu um erro ao tentar criar o cliente' });
  }
});

app.get('/cliente/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const cliente = await prisma.cliente.findUnique({
    where: { id },
  });

  res.json(cliente);
});

app.delete('/cliente/excluir/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const cliente = await prisma.cliente.delete({
    where: { id },
  });

  res.json(cliente);
});

app.put('/cliente/atualizar/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const cliente = await prisma.cliente.update({
    where: { id },
    data: req.body,
  });

  res.json(cliente);
});

app.listen(3001, () => { console.log('Servidor rodando na porta 3001'); });