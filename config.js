/* =============================================================
   DOCE MOMENTO • CONFIGURAÇÕES DA LOJA
   Edite os dados abaixo antes de publicar e receber pedidos.
   Não coloque senhas, tokens ou dados sigilosos neste arquivo.
   ============================================================= */
window.LOJA = {
  nome: "Doce Momento",
  slogan: "Brownies artesanais feitos com carinho",
  cidade: "Arcoverde - PE",
  // Contato informado: +55 87 9130-9425 (8 dígitos locais).
  // IMPORTANTE: confira se esse número está cadastrado no WhatsApp.
  // Alguns números comerciais têm 8 dígitos; não acrescentamos um 9 sem confirmação.
  // Formato: país 55 + DDD (2 dígitos) + número local (8 ou 9 dígitos).
  whatsapp: "558791309425",
  instagram: "",

  // Pix em conta bancária do proprietário: CPF, CNPJ, telefone, e-mail ou chave aleatória.
  // ATENÇÃO: publique apenas a chave Pix que aceita divulgar publicamente.
  pixChave: "",
  pixNome: "DOCE MOMENTO",   // nome conforme cadastro Pix, até 25 caracteres
  pixCidade: "ARCOVERDE",    // até 15 caracteres

  // Insira uma taxa FIXA de entrega em reais, como 5.00.
  // Deixe null para 'taxa a confirmar' (Pix fica indisponível até definir o valor).
  // Use 0 SOMENTE se a entrega for realmente gratuita.
  taxaEntrega: null,

  // Pedidos feitos a partir desse horário vão para o dia posterior ao seguinte.
  horaLimite: 18,

  // PREÇOS ILUSTRATIVOS — altere para seus preços reais antes de divulgar.
  produtos: [
    // Cada sabor possui sua foto exclusiva na pasta assets/.
    { id: "tradicional", nome: "Tradicional", descricao: "O clássico brownie de chocolate, intenso e cremoso, com casquinha crocante.", preco: 12.00, imagem: "assets/brownie-tradicional.webp", selo: "Mais pedido" },
    { id: "nozes", nome: "Chocolate com Nozes", descricao: "Brownie de chocolate cremoso com pedaços de nozes crocantes.", preco: 14.00, imagem: "assets/brownie-nozes.webp", selo: "Com nozes" },
    { id: "branco", nome: "Chocolate Branco", descricao: "Brownie de chocolate com pedaços deliciosos de chocolate branco.", preco: 14.00, imagem: "assets/brownie-chocolate-branco.webp", selo: "Chocolate branco" },
    { id: "kit4", nome: "Kit com 4 Brownies", descricao: "Quatro unidades para dividir, presentear ou aproveitar.", preco: 44.00, imagem: "assets/embalagem-brownies.webp", selo: "Para presentear" }
  ]
};
