# 🍫 Doce Momento — Landing page para GitHub Pages

Site responsivo de brownies artesanais, rosa-claro e lilás, com embalagem corrigida (brownie na faixa, não brigadeiro) e fotos ilustrativas criadas para o projeto, cardápio, carrinho, formulário de entrega, mensagem de pedido para o WhatsApp e **Pix copia e cola + QR Code (quando configurados)**.

> **LEIA ANTES DE PUBLICAR:** o site é estático. A loja precisa confirmar manualmente os pedidos, estoque, taxa de entrega e pagamentos pelo WhatsApp. O GitHub Pages **não** guarda pedidos nem verifica Pix automaticamente. Não deixe a chave Pix, o WhatsApp e os preços de exemplo sem revisão.

## Publicar no GitHub — sem instalar programas

1. Entre em https://github.com/new e crie um repositório **público** chamado `doce-momento-brownies`.
2. Baixe o arquivo ZIP do projeto e **extraia** no computador.
3. No repositório, clique em **Add file → Upload files**.
4. Envie **o conteúdo** da pasta `doce-momento-github` — `index.html`, `config.js`, as pastas `assets/`, `css/`, `js/` e os outros arquivos. O `index.html` precisa ficar **na raiz**, não dentro de outra pasta. Não envie somente o ZIP.
5. Clique em **Commit changes**.
6. Abra **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
7. Escolha `main` e `/(root)` e clique em **Save**.
8. O endereço será parecido com `https://SEU-USUARIO.github.io/doce-momento-brownies/` (a publicação pode levar alguns minutos).

Documentação: https://docs.github.com/pt/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Configurar antes de publicar

Abra **`config.js`** e edite somente as configurações da loja:

```js
whatsapp: "5587999999999", // substitua pelo WhatsApp verdadeiro da loja
instagram: "sua_doceria",
pixChave: "sua-chave-pix", // chave da conta que recebe o dinheiro
pixNome: "NOME DO RECEBEDOR",
pixCidade: "ARCOVERDE",
taxaEntrega: 5.00, // substitua pelo frete real; 0 apenas se entrega gratuita
horaLimite: 18,
```

**ATENÇÃO:** a chave Pix e os dados do recebedor inseridos em `config.js` serão **públicos na internet**. Isso é próprio de um Pix estático com chave pública; não insira senhas bancárias, tokens, credenciais privadas ou dados confidenciais nesse arquivo.

Os **quatro produtos e preços são EXEMPLOS** para visualização. Edite o array `produtos` no `config.js` para colocar valores, nomes e sabores reais. Os produtos podem ter fotos diferentes: coloque a imagem na pasta `assets/` e ajuste o campo `imagem`.

### E se a taxa de entrega variar por bairro?

Deixe `taxaEntrega: null`. O carrinho monta o pedido, mas o Pix **não aparece**, porque o valor final depende do frete. Combine a taxa no WhatsApp e informe o Pix real ao cliente manualmente. Para cobrar valor total automático por bairro, cadastre uma tabela de fretes e adicione um cálculo correspondente no sistema.

## Como o pedido funciona nesta versão

1. Cliente escolhe produtos, adiciona quantidades ao carrinho e informa nome, WhatsApp e endereço.
2. O site sugere entrega para o dia seguinte em horário local de Pernambuco, ou para o segundo dia seguinte após `horaLimite`.
3. Cliente clica em **Enviar pedido pelo WhatsApp**. O site abre a conversa com mensagem pronta; **o cliente precisa enviar a mensagem**.
4. Com WhatsApp, Pix e taxa de entrega configurados, o site mostra QR Code Pix e código copia e cola com o valor dos produtos + frete.
5. A loja verifica o pedido, informa disponibilidade e **confirma o pagamento manualmente no aplicativo bancário** antes de produzir/entregar. O cliente pode enviar o comprovante pelo WhatsApp.

**Não trate uma mensagem ou comprovante como pagamento confirmado.** Confirme o crédito na própria conta bancária. A data de entrega é previsão, sujeita à aceitação pela loja. As imagens são ilustrativas: reproduza apenas produtos realmente oferecidos.

## Organização

```text
doce-momento-github/
├── index.html            # Conteúdo e estrutura do site
├── config.js             # ⚙️ Editar WhatsApp, Pix, frete, preços e sabores
├── css/
│   └── style.css         # Cores, fontes, layout e responsividade
├── js/
│   ├── app.js            # Carrinho, formulário, Pix e WhatsApp
│   └── qr-matrix.js      # Gerador local do QR Code (MIT)
├── assets/
│   ├── brownie-hero.webp
│   ├── brownie-cremoso.webp
│   ├── embalagem-brownies.webp
│   ├── caixa-isopor.webp
│   └── favicon.svg
├── LICENSE-QR.txt
├── .nojekyll
└── README.md
```

## Para receber pedidos e confirmar Pix automaticamente

É preciso um **backend** (por exemplo, Supabase/Firebase + função serverless), um provedor de pagamento Pix com API/webhook e proteção de acesso a pedidos. GitHub Pages continua hospedando o visual, mas a parte financeira deve ficar em servidor seguro.

Desenvolvido para personalização pela **Dev Kayko**. Fotos do material gráfico são ilustrações, não fotos de produtos reais já vendidos.
