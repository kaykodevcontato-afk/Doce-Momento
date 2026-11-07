/* =============================================================
   DOCE MOMENTO • CONFIGURAÇÕES DA LOJA
   Edite os dados abaixo antes de publicar e receber pedidos.
   Não coloque senhas, tokens ou dados sigilosos neste arquivo.
   ============================================================= */
window.LOJA = {
  nome: "Doce Momento",
  slogan: "Brownies artesanais feitos com carinho",
  cidade: "Arcoverde - PE",
  // SOMENTE NÚMEROS, com DDI 55 e DDD. Ex.: "5587999999999"
  whatsapp: "",
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
    { id: "tradicional", nome: "Tradicional Cremoso", descricao: "Casquinha delicada, chocolate intenso e interior macio.", preco: 12.00, imagem: "assets/brownie-hero.webp", selo: "Mais pedido" },
    { id: "chocolate", nome: "Duplo Chocolate", descricao: "Massa chocolatuda com recheio bem cremoso.", preco: 14.00, imagem: "assets/brownie-cremoso.webp", selo: "Extra cremoso" },
    { id: "recheado", nome: "Brownie Recheado", descricao: "Textura irresistível e chocolate derretendo por dentro.", preco: 15.00, imagem: "assets/brownie-hero.webp", selo: "Especial" },
    { id: "kit4", nome: "Kit com 4 Brownies", descricao: "Quatro unidades para dividir, presentear ou aproveitar.", preco: 44.00, imagem: "assets/embalagem-brownies.webp", selo: "Para presentear" }
  ]
};
