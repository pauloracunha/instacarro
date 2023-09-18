# Instacarro

## Setup

npm install

1. Criar o arquivo .env `cp .env.example .env`

2. Definir variáveis .env  
   DATABASE_NAME e DATABASE_PASSWORD
   JWT_SECRET, SESSION_SECRET e ACCESS_TOKEN_SECRET
   Obs.: para gerar chaves rodar `openssl rand -base64 32`

3. Levantar o banco de dados  
   `docker compose up -d`

4. Iniciar a Aplicação
   `npm run start`

## TODO

- [ ] Testes
- [ ] Funções de administrador
