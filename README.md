<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="http://updata.com.br/logo_mkedge.png" alt="Logo" height="80">
  </a>

  <h3 align="center">MK-Edge</h3>

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

# MK-Edge
O Mk-Edge é um micro-saas desenvolvido como complemento ao já consolidado sistema de gerenciamento de provedores de internet, o MK-Auth (http://mk-auth.com.br).

MK-Edge é uma versão mobile do módulo de suporte do MK-Auth que tem mudado completamente a forma de trabalho dos provedores. Oferece interface simples e intuitiva, acesso à todas as ordens de serviço do sistema principal, acesso a dados do clientes como telefone, endereço, coordendas de navegação, informações de conexão e dados financeiros.

## Como esta aplicação está sendo construída
O backend desta aplicação está rodando uma API Rest construída utilizando NodeJS e Express, com sistema de autenticação JWT (ainda não desenvolvido) e conexão direta com o banco de dados responsável por alimentar o MK-Auth em sua versão web. Toda a manipulação de tabelas e queries estão sendo realizadas através do ORM Sequelize que possibilta a utilização de javascript para realizá-los.

O frontend também está sendo construido interiamente utilizando Javascript e utilizando como principal biblioteca o React Native.

## Como rodar está aplicação
A aplicação hoje ainda encontra-se em desenvolvimento, no entanto possui uma versão rodando em produção. Porém devido a sensibilidade de todos os dados de clientes, não disponibilizamos uma versão para que seja possível rodar em sua própria máquina.

Assim que a maior parte das funcionalidades desenvolvidas para este sistema estiverem desenvolvidas, uma versão inteiramente completa com dados ficticios será disponibilizada para que seja possível rodá-la a qualquer momento.

Por agora, estas são algumas screenshots disponíveis para acompanhamento do trabalho:

<div style="display: flex; flex-direction: row;">
  <img height="600" src="https://user-images.githubusercontent.com/55609083/80551743-805c8900-8992-11ea-943c-6bcbaba87ddc.JPG"/>
  <img height="600" src="https://user-images.githubusercontent.com/55609083/80551740-7f2b5c00-8992-11ea-82f5-1651bbe04808.JPG"/>
  <img height="600" src="https://user-images.githubusercontent.com/55609083/80551742-805c8900-8992-11ea-8fe2-36c1e7db220a.JPG"/>
  <img height="600" src="https://user-images.githubusercontent.com/55609083/80551745-818db600-8992-11ea-868e-8e9352bd758c.JPG"/>
  <img height="600" src="https://user-images.githubusercontent.com/55609083/80551746-818db600-8992-11ea-8196-ada602a38512.JPG"/>
  <img height="600" src="https://user-images.githubusercontent.com/55609083/80551744-80f51f80-8992-11ea-8f7f-850ca69e653c.JPG"/>
  
  
</div>
