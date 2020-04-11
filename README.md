# Ordem de Serviço - MK-Auth 
Este projeto funciona como aplicativo de gerenciamento de ordens de serviços desenvolvido exclusivamente para integração com um dos softwares de gerenciamento de provedores de internet mais utilizados do Brasil: MK-Auth (http://mk-auth.com.br).

## Como esta aplicação está sendo construída
O backend desta aplicação está rodando uma API Rest construída utilizando NodeJS e Express, com sistema de autenticação JWT (ainda não desenvolvido) e conexão direta com o banco de dados responsável por alimentar o MK-Auth em sua versão web. Toda a manipulação de tabelas e queries estão sendo realizadas através do ORM Sequelize que possibilta a utilização de javascript para realizá-los.

O frontend também está sendo construido interiamente utilizando Javascript e utilizando como principal biblioteca o React Native.

## Como rodar está aplicação
A aplicação hoje ainda encontra-se em desenvolvimento, no entanto possui uma versão rodando em produção. Porém devido a sensibilidade de todos os dados de clientes, não disponibilizamos uma versão para que seja possível rodar em sua própria máquina.

Assim que a maior parte das funcionalidades desenvolvidas para este sistema estiverem desenvolvidas, uma versão inteiramente completa com dados ficticios será disponibilizada para que seja possível rodá-la a qualquer momento.

Por agora, estas são algumas screenshots disponíveis para acompanhamento do trabalho:

![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)
![Image description](https://ibb.co/Ks7WF65)
