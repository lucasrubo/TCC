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

Remodela seu branch para conseguir puxar mudancas sem problema:
`git rebase main`

reseta para o branch para igualar a branch principal, deixando todos seus commits intactos:
`git reset --soft main`

Puxa os commits da main:
`git pull main`

Restaura seus commits depois de um reset --soft:
`git restore --staged .`

Adiciona todos os arquivos que foram criados pelos seus commits:
`git add .`
