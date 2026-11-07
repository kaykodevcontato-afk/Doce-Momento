# 🍫 Doce Momento — Landing page para GitHub Pages

Site responsivo de brownies artesanais, rosa-claro e lilás, com embalagem corrigida (brownie na faixa, não brigadeiro) e fotos diferentes para cada sabor (Tradicional, Chocolate com Nozes e Chocolate Branco), cardápio, carrinho, formulário de entrega, mensagem de pedido para o WhatsApp e **Pix copia e cola + QR Code (quando configurados)**.

> **WhatsApp de pedidos:** `+55 87 99130-9425`, configurado em `config.js`. O número não aparece como texto na página; o botão apenas abre a conversa.

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
whatsapp: "5587991309425", // link de pedidos; número não aparece na página
instagram: "sua_doceria",
pixChave: "sua-chave-pix", // chave da conta que recebe o dinheiro
pixNome: "NOME DO RECEBEDOR",
pixCidade: "ARCOVERDE",
taxaEntrega: 5.00, // substitua pelo frete real; 0 apenas se entrega gratuita
horaLimite: 18,
```

**ATENÇÃO:** a chave Pix e os dados do recebedor inseridos em `config.js` serão **públicos na internet**. Isso é próprio de um Pix estático com chave pública; não insira senhas bancárias, tokens, credenciais privadas ou dados confidenciais nesse arquivo.

Os **quatro produtos e preços são EXEMPLOS** para visualização. Edite o array `produtos` no `config.js` para colocar valores, nomes e sabores reais. Cada produto já tem sua própria foto. Para trocar ou adicionar novos sabores, coloque a imagem na pasta `assets/` e ajuste o campo `imagem`.

### E se a taxa de entrega variar por bairro?

Deixe `taxaEntrega: null`. O carrinho monta o pedido, mas o Pix **não aparece**, porque o valor final depende do frete. Combine a taxa no WhatsApp e informe o Pix real ao cliente manualmente. Para cobrar valor total automático por bairro, cadastre uma tabela de fretes e adicione um cálculo correspondente no sistema.

## Como o pedido funciona nesta versão

1. Cliente escolhe produtos, adiciona quantidades ao carrinho e informa nome e WhatsApp. Ao digitar 8 dígitos de CEP, o formulário consulta o **ViaCEP** automaticamente e preenche rua, bairro e cidade/UF. O número e complemento da casa continuam manuais. Se o serviço falhar ou não tiver a rua, o usuário pode digitar o endereço manualmente.
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
│   ├── app.js            # Carrinho, formulário, ViaCEP, Pix e WhatsApp
│   └── qr-matrix.js      # Gerador local do QR Code (MIT)
├── assets/
│   ├── brownie-tradicional.webp  # Foto do tradicional
│   ├── brownie-nozes.webp         # Foto do brownie com nozes
│   ├── brownie-chocolate-branco.webp # Foto do chocolate branco
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

## CEP automático

O formulário utiliza o serviço gratuito **ViaCEP** (`https://viacep.com.br/ws/CEP/json/`). O navegador envia somente o CEP à API quando ele possui oito dígitos; não envia nome, telefone, número da casa nem complemento. Se o CEP não for localizado ou o serviço ficar indisponível, o pedido continua possível com preenchimento manual. O cliente deve conferir a rua, bairro, cidade e número antes de enviar. O serviço não calcula frete nem verifica a cobertura de entrega.

Documentação: https://viacep.com.br/

### Novo visual da foto principal
A moldura em arco foi substituída por um recorte orgânico sem borda grossa.
Para ajustar o formato, procure a seção `FOTO PRINCIPAL — NOVO DESIGN` no final de `css/style.css`.
