# Teste Prático - Sistema de Agendamento Leila Salon

Este projeto consiste em uma solução personalizada de agendamentos online desenvolvida para o salão de beleza da Leila, atendendo aos requisitos fundamentais, operacionais e gerenciais descritos na avaliação técnica da DSIN.

---

## Tecnologias Utilizadas

### Back-end
* **Node.js & Express**: Estrutura de roteamento e criação da API REST sob o padrão arquitetural MVC (Model-View-Controller).
* **MongoDB & Mongoose**: Banco de dados NoSQL e modelagem de dados estrita através de Schemas organizados.
* **Dotenv**: Gerenciamento seguro de variáveis de ambiente.

### Front-end
* **React.js (Vite)**: Biblioteca para construção de uma interface de usuário componentizada, reativa e de página única (SPA).
* **Tailwind CSS**: Framework utilitário para estilização fluida, moderna e totalmente adaptada para dispositivos móveis (Mobile First).
* **Axios**: Cliente HTTP para consumo da API REST de agendamentos.
* **React Router Dom**: Gerenciamento de rotas e navegação do ecossistema front-end.

---

## Como Rodar o Projeto

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* Node.js (versão 16 ou superior)
* Uma instância do MongoDB rodando localmente ou uma URI do MongoDB Atlas

### Passo 1: Configuração do Back-end
1. Navegue até a pasta do back-end através do terminal:
   ```bash
   cd backend

2. ```bash
    npm install

3. Crie um arquivo chamado .env na raiz da pasta backend e configure a sua porta e string de conexão do banco de dados:

    PORT=5000
    MONGO_URI=sua_string_de_conexao_do_mongodb

4. ```bash
    node src/seed.js

5. ```bash
    node src/server.js

6. Em um novo terminal, navegue até a pasta do front-end
    ```bash
    cd frontend
7.  
    ```bash
    npm install
    
8.  ```bash
    npm run dev


Credenciais de Teste Padrão
## Caso queira testar os diferentes fluxos da aplicação imediatamente através dos dados populados pelo seed.js:

### Acesso do Administrador (Visão da Leila):

Telefone: 14999999999

Senha: admin123

### Regras de Negócio:

Regra Automatizada de Bloqueio por Antecedência (2 Dias): O sistema calcula de forma estrita em milissegundos a antecedência de cada atendimento. Agendamentos com menos de 2 dias de prazo perdem o botão de exclusão da interface do cliente e são travados no middleware de validação do back-end. Adicionalmente, quando o cliente lista seu histórico, o servidor verifica se o agendamento pendente cruzou a janela limite e atualiza seu status para "Confirmado" de forma transparente e automática.

Painel Administrativo Independente: A interface administrativa foi isolada através de verificação de permissões do usuário logado (role: 'Administrador'). O painel operacional gerencial permite que a Leila visualize todos os agendamentos realizados no salão e execute cancelamentos irrestritos imediatos.

Interface Sem Alertas Nativos: Em conformidade com os princípios modernos de usabilidade e UX, todos os diálogos de confirmação de exclusão e caixas de avisos informativos em tela foram estruturados com componentes e modais interativos construídos puramente em Tailwind CSS, eliminando o uso de métodos rudimentares como alert() ou confirm().

Interface limpa e responsiva



### Para melhor visualização existe uma pasta "docs" onde tera imgs e videos do funcionamento no app