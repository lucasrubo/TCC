# TCC
Trabalho de Conclusão de Curso Ciência da Computação

# Clonar repositorio 
`cd c:/`

`git clone https://github.com/lucasrubo/TCC.git`

# Commits
Sempre que for commitar siga um padrao!

Ex.: `git commit -a -m "build(pyhton): adicionou autologon pelo facebook"`

### Prefixos:

`build(local)`

`fix(local)`

`feat(local)`

`doc(local)`

# Rebase na hora de dar um Pull Request
Recomendo nao mexermos no mesmo arquivo ao mesmo tempo!

Caso precise juntar alguns commits em um só:
`git rebase -i HEAD~2`

### Caso precise juntar muitos commits em um só:

Remodela seu branch para conseguir puxar mudancas sem problema:
`git rebase origin main`

reseta para o branch para igualar a branch principal, deixando todos seus commits intactos:
`git reset --soft main`

Puxa os commits da main:
`git pull origin main`

Restaura seus commits depois de um reset --soft:
`git restore --staged .`

Adiciona todos os arquivos que foram criados pelos seus commits:
`git add .`


# Criando o environment para rodar a aplicação

COMO RODAR O PROJETO BAIXADO
Instalar todas as dependencias indicada pelo package.json
### npm install

Rodar o projeto com nodemon
### nodemon app.js



SEQUENCIA PARA CRIAR O PROJETO

Gerencia as requisições, rotas e URLs, entre outra funcionalidades
### npm install express

Rodar o projeto 
### node app.js

Acessar o projeto no navegador
### http://localhost:8080

Instalar o módulo para reiniciar o servidor sempre que houver alteração no código fonte, g significa globalmente
### npm install -g nodemon
### npm install --save-dev nodemon
### Set-ExecutionPolicy RemoteSigned

Rodar o projeto com nodemon
### nodemon app.js

Sequelize é uma biblioteca Javascript que facilita o gerenciamento de um banco de dados SQL
### npm install --save sequelize

Instalar o drive do banco de dados
### npm install --save mysql2

Depois de instalar o MySql e o workbench rodar o database:
`CREATE DATABASE tcc character set utf8mb4 collate utf8mb4_unicode_ci;`
