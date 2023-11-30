-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nomeSocial" TEXT NOT NULL,
    "genero" TEXT NOT NULL,    
    "dataCadastro" DATETIME NOT NULL,
    "quantidadeConsumida" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "quantidadeConsumida" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "quantidadeConsumida" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "CPF" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" TEXT NOT NULL,
    "dataEmissao" DATETIME NOT NULL,
    "clienteId" INTEGER NOT NULL,
    CONSTRAINT "CPF_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RG" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "valor" TEXT NOT NULL,
    "dataEmissao" DATETIME NOT NULL,
    "clienteId" INTEGER NOT NULL,
    CONSTRAINT "RG_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Telefone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ddd" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    CONSTRAINT "Telefone_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "empresaId" INTEGER NOT NULL,
    CONSTRAINT "Compra_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ClientesDaEmpresa" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ClientesDaEmpresa_A_fkey" FOREIGN KEY ("A") REFERENCES "Cliente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ClientesDaEmpresa_B_fkey" FOREIGN KEY ("B") REFERENCES "Empresa" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ProdutosDaEmpresa" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProdutosDaEmpresa_A_fkey" FOREIGN KEY ("A") REFERENCES "Empresa" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProdutosDaEmpresa_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ServicosDaEmpresa" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ServicosDaEmpresa_A_fkey" FOREIGN KEY ("A") REFERENCES "Empresa" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ServicosDaEmpresa_B_fkey" FOREIGN KEY ("B") REFERENCES "Servico" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpfId_key" ON "Cliente"("cpfId");

-- CreateIndex
CREATE UNIQUE INDEX "CPF_clienteId_key" ON "CPF"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientesDaEmpresa_AB_unique" ON "_ClientesDaEmpresa"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientesDaEmpresa_B_index" ON "_ClientesDaEmpresa"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutosDaEmpresa_AB_unique" ON "_ProdutosDaEmpresa"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutosDaEmpresa_B_index" ON "_ProdutosDaEmpresa"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ServicosDaEmpresa_AB_unique" ON "_ServicosDaEmpresa"("A", "B");

-- CreateIndex
CREATE INDEX "_ServicosDaEmpresa_B_index" ON "_ServicosDaEmpresa"("B");
