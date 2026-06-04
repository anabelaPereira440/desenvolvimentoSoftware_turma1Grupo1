======================================================================
BREATHCARE HEALTH SYSTEM
Sistema de Prevencao e Acompanhamento de Doencas Respiratorias
======================================================================

Este ficheiro contem as instrucoes necessarias para a instalacao, configuracao e execucao local da Web API e do Cliente Web do sistema BreathCare Health System, desenvolvido pelo Grupo 1 da Turma 1 em Junho de 2026.

----------------------------------------------------------------------
1. TECNOLOGIAS UTILIZADAS
----------------------------------------------------------------------
* Backend: Node.js com TypeScript
* Framework Web: Express
* Base de Dados: SQLite (Ficheiro local "data.db")
* Frontend: HTML5 e JavaScript (API nativa "fetch")

----------------------------------------------------------------------
2. PRE-REQUISITOS
----------------------------------------------------------------------
Certifique-se de que tem o Node.js instalado no seu computador. 
Pode verificar abrindo um terminal e digitando os comandos:

node -v
npm -v

----------------------------------------------------------------------
3. INSTRUCOES DE EXECUCAO (PASSO A PASSO)
----------------------------------------------------------------------

PASSO 3.1: Abrir o Projeto no IDE
1. Abra o Visual Studio Code (VS Code).
2. No menu superior, selecione: File -> Open Folder...
3. Escolha a pasta raiz do projeto (onde se encontra o ficheiro 
   "package.json" e a pasta "src").

PASSO 3.2: Instalar as Dependencias
1. Abra o terminal integrado do VS Code (menu Terminal -> New Terminal).
2. Execute o seguinte comando para instalar o Express, o TypeScript 
   e todas as bibliotecas necessarias:

npm install

PASSO 3.3: Inicializar e Correr o Servidor
1. No mesmo terminal do VS Code, execute o comando para iniciar o 
   servidor Express atraves do executor de TypeScript:

npx ts-node src/app.ts

2. O terminal devera exibir uma mensagem confirmando que o servidor 
   foi ativado com sucesso na porta 3000 e que esta conectado ao 
   ficheiro de base de dados SQLite "data.db".

PASSO 3.4: Aceder ao Sistema Completo
1. Abra o seu navegador web (Google Chrome, Edge, Firefox ou Safari).
2. Aceda ao seguinte endereco:

http://localhost:3000/

A partir deste endereco (que carrega o ficheiro "index.html" da pasta publica), devera efetuar o login com os dados dos utilizadores simulados para ter acesso completo aos portais do Utente, Medico e Administrador.

----------------------------------------------------------------------
4. DADOS SIMULADOS
----------------------------------------------------------------------
O sistema ja se encontra configurado com um mecanismo de seed automatico.
Aquando da primeira inicializacao do servidor (Passo 3.3), a base de dados SQLite e automaticamente populada com dados inventados/simulados. 
Isto inclui perfis de teste para o Administrador, Medicos e Utentes (com os respetivos historicos de sintomas, medicacoes e questionarios CARAT), permitindo a avaliacao imediata do sistema sem necessidade de insercao manual de dados.

----------------------------------------------------------------------
AUTORAS - (TURMA 1 - GRUPO 1)
----------------------------------------------------------------------
* Anabela Morais Pereira (202406638)
* Carlota de Castro Ribeiro e Pereira Sobral (202403584)
* Diana Judite Xavier Galhardo (202403936)
* Iva Moura Alves (202404407)
======================================================================