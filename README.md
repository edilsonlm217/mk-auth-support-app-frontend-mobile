<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="http://updata.com.br/logo_mkedge.png" alt="Logo" height="80">
  </a>

  <p align="center">
    MK-Edge é uma versão mobile do módulo de suporte do MK-Auth que tem mudado completamente a forma de trabalho dos provedores de internet no Brasil
    
  <br />
  <a href="https://github.com/github_username/repo_name">Baixar Demo</a>
  ·
  <a href="https://github.com/github_username/repo_name/issues">Reportar Bug</a>
  ·
  <a href="https://github.com/github_username/repo_name/issues">Solicitar Feature</a>
  </p>
</p>

## Sobre o projeto
O Mk-Edge é um micro-saas desenvolvido como complemento ao já consolidado sistema de gerenciamento de provedores de internet, o MK-Auth (http://mk-auth.com.br).

MK-Edge é uma versão mobile do módulo de suporte do MK-Auth que tem mudado completamente a forma de trabalho dos provedores de interenet do Brasil. Oferece interface simples e intuitiva, acesso à todas as ordens de serviço do sistema principal, agenda de atendimento por técnico, acesso a dados dos clientes como telefone, endereço, coordendas de navegação, informações de conexão e dados financeiros.

Atualmente em sua versão BETA, MK-Edge já possui usuários ativos em mais de 5 estados brasileiros: Rio Grande do Norte, Paraíba, Amazonas, Minas Gerais, Matro Grosso do Sul e Goiás.


## Como este projeto foi construído
O App foi desenvolvido utilizando React Native e seu backend está rodando uma API Rest construída utilizando NodeJS e Express com sistema de autenticação JWT e arquitetura multitenancy.

A parte mais desafiadora e interessante deste projeto foi desenvolver uma infraestrutura que funcionasse bem com a infra já existente no cliente. Isso porque cada cliente possui um servidor na web rodando com seu respectivo banco de dados. O desafio aqui foi manter uma única codebase (tanto de backend quanto de frontend) capaz de comunicar com diferentes bancos de dados e que oferecesse um exelente percentual de disponibilidade de dados aos usuários.

Para alcançar este resultado utilizamos o SymmetricDS  que é uma ferramenta de replicação (https://www.symmetricds.org). Com ela foi possível ter um espelho do database dos clientes com sincronização em tempo real e disponibilidade de 98%.

Esta solução tornou o processo de ativação de um cliente rápido e simples! Cada cliente possui uma chave de acesso (por provedor) que é informada no momento da autenticação no app. Esta chave é o artefato pelo qual a API consegue identificar que cliente está requisitando do servidor e de qual database esses dados devem ser recuperados.

<img src="https://user-images.githubusercontent.com/55609083/105617058-7c8b5500-5db2-11eb-979f-1a280326166d.png" alt="screen_1">
<img src="https://user-images.githubusercontent.com/55609083/105617144-8f525980-5db3-11eb-9e2d-fcc59f89af87.png" alt="screen_2">
