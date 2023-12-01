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



// Rota para obter todos os clientes
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        endereco: true,
        telefones: true,
      },
    });
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar buscar os clientes' });
  }
});

// Rota para obter um cliente específico
app.get('/cliente/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        endereco: true,
        telefones: true,
      },
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar buscar o cliente' });
  }
});

// Rota para excluir um cliente
app.delete('/cliente/excluir/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    // Excluir os endereços e telefones do cliente
    await prisma.endereco.deleteMany({
      where: { clienteId: id },
    });

    await prisma.telefone.deleteMany({
      where: { clienteId: id },
    });

    // Excluir o cliente
    const cliente = await prisma.cliente.delete({
      where: { id },
    });

    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar excluir o cliente' });
  }
});

// Rota para cadastrar um novo cliente
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

// Rota para atualizar um cliente
// Rota para atualizar um cliente
app.put('/cliente/atualizar/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, nomeSocial, genero, dataCadastro, endereco, telefones } = req.body;

  try {
    // Atualizar o cliente
    await prisma.cliente.update({
      where: { id: Number(id) },
      data: {
        nome,
        nomeSocial,
        genero,
        dataCadastro: new Date(dataCadastro),
      },
    });

    // Atualizar o endereço
    await prisma.endereco.update({
      where: { clienteId: Number(id) },
      data: endereco,
    });

    // Atualizar os telefones
    await Promise.all(
      telefones.map((telefone) =>
        prisma.telefone.update({
          where: { id: telefone.id },
          data: telefone,
        })
      )
    );

    // Buscar o cliente atualizado com o endereço e telefones
    const clienteComEnderecoETelefones = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: {
        endereco: true,
        telefones: true,
      },
    });

    res.json(clienteComEnderecoETelefones);
  } catch (error) {
    console.error('Erro ao atualizar o cliente:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar atualizar o cliente' });
  }
});

// Rota para obter todos os produtos/serviços
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar buscar os produtos' });
  }
});

// Rota para obter um produto/serviço específico
app.get('/produto/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const produto = await prisma.produto.findUnique({
      where: { id },
    });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar buscar o produto' });
  }
});

// Rota para excluir um produto/serviço
app.delete('/produto/excluir/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const produto = await prisma.produto.delete({
      where: { id },
    });

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar excluir o produto' });
  }
});

// Rota para cadastrar um novo produto/serviço
app.post('/produto/cadastrar', async (req, res) => {
  const { nome, valor } = req.body;

  try {
    const produto = await prisma.produto.create({
      data: {

        nome,
        valor,
      },
    });

    res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar criar o produto' });
  }
});

// Rota para atualizar um produto/serviço
app.put('/produto/atualizar/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, valor } = req.body;

  try {
    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: {
        nome,
        valor,
      },
    });

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar atualizar o produto' });
  }
});

app.get('/servicos', async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany();
    res.json(servicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar buscar os servicos' });
  }
});

// Rota para obter um produto/serviço específico
app.get('/servico/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const servico = await prisma.servico.findUnique({
      where: { id },
    });

    if (!servico) {
      return res.status(404).json({ error: 'servico não encontrado' });
    }

    res.json(servico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar buscar o servico' });
  }
});

// Rota para excluir um servico/serviço
app.delete('/servico/excluir/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const servico = await prisma.servico.delete({
      where: { id },
    });

    res.json(servico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar excluir o servico' });
  }
});

// Rota para cadastrar um novo servico/serviço
app.post('/servico/cadastrar', async (req, res) => {
  const { nome, valor } = req.body;

  try {
    const servico = await prisma.servico.create({
      data: {
        nome,
        valor,
      },
    });

    res.status(200).json(servico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar criar o servico' });
  }
});

// Rota para atualizar um servico/serviço
app.put('/servico/atualizar/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, valor } = req.body;

  try {
    const servico = await prisma.servico.update({
      where: { id: Number(id) },
      data: {
        nome,
        valor,
      },
    });

    res.json(servico);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao tentar atualizar o servico' });
  }
});


app.listen(3001, () => { console.log('Servidor rodando na porta 3001'); });


