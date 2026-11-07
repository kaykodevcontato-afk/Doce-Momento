/* Doce Momento • sem framework, preparado para GitHub Pages.
   Não registra dados pessoais: eles são transmitidos apenas quando o comprador
   confirma o envio pelo WhatsApp. Sem back-end não há conciliação Pix automática. */
(() => {
  'use strict';
  const cfg = window.LOJA || {};
  const products = Array.isArray(cfg.produtos) ? cfg.produtos : [];
  const $ = selector => document.querySelector(selector);
  const brl = v => new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'}).format(Number(v) || 0);
  const html = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const validShipping = Number.isFinite(cfg.taxaEntrega) && cfg.taxaEntrega >= 0;
  const shipping = validShipping ? cfg.taxaEntrega : null;
  const whatsapp = String(cfg.whatsapp||'').replace(/\D/g, '');
  // Aceita números nacionais com DDD + 8 ou 9 dígitos.
  // O número de 8 dígitos foi fornecido pelo proprietário e não é "corrigido" por suposição.
  // A validação não confirma que o número tenha conta no WhatsApp.
  const whatsappValido = /^55[1-9]\d\d{8,9}$/.test(whatsapp);
  const whatsappOitoDigitos = /^55[1-9]\d\d{8}$/.test(whatsapp);
  let cart = {};
  let toastTimer;
  let orderId = '';

  // Guarda apenas o ID e a quantidade de cada produto (sem dados de clientes).
  try {
    const saved = JSON.parse(localStorage.getItem('doce_momento_cart_v1') || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const p of products) {
        const n = Number(saved[p.id]);
        if (Number.isSafeInteger(n) && n > 0 && n <= 99) cart[p.id] = n;
      }
    }
  } catch (_) { /* navegador pode desativar armazenamento */ }
  const persist = () => { try { localStorage.setItem('doce_momento_cart_v1', JSON.stringify(cart)); } catch (_) {} };
  const subtotal = () => products.reduce((sum,p) => sum + (cart[p.id]||0) * Number(p.preco||0), 0);
  const itemsCount = () => Object.values(cart).reduce((sum,n) => sum+n,0);
  const toast = msg => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 3300);
  };

  function productsRender() {
    $('#productGrid').innerHTML = products.map(p => `
      <article class="product-card">
        <div class="product-image"><img src="${html(p.imagem)}" alt="${html(p.nome)} - brownie artesanal" loading="lazy"><span class="product-badge">${html(p.selo||'Feito com amor')}</span></div>
        <div class="product-content"><h3>${html(p.nome)}</h3><p>${html(p.descricao)}</p>
          <div class="product-footer"><span class="product-price">${brl(p.preco)}</span><button class="add-button" data-add="${html(p.id)}" aria-label="Adicionar ${html(p.nome)} ao carrinho" title="Adicionar ao carrinho">＋</button></div>
        </div>
      </article>`).join('');
  }

  function updateCart() {
    $('#cartCount').textContent = itemsCount();
    $('#cartSubtotal').textContent = brl(subtotal());
    $('#cartFeeNotice').textContent = validShipping
      ? `Entrega: ${shipping === 0 ? 'grátis' : brl(shipping)}. Valor final calculado no checkout.`
      : 'Entrega: valor a confirmar no WhatsApp, antes do pagamento.';
    $('#startCheckout').disabled = itemsCount() === 0;
    const els = products.filter(p => cart[p.id]);
    $('#cartItems').innerHTML = els.length ? els.map(p => `
      <div class="cart-item"><img src="${html(p.imagem)}" alt="${html(p.nome)}" loading="lazy">
        <div><strong>${html(p.nome)}</strong><small>${brl(p.preco)} cada</small>
          <div class="qty-row"><div class="qty-controls"><button data-decrease="${html(p.id)}" type="button" aria-label="Diminuir quantidade">−</button><span>${cart[p.id]}</span><button data-increase="${html(p.id)}" type="button" aria-label="Aumentar quantidade">+</button></div><button class="remove-item" type="button" data-remove="${html(p.id)}">Remover</button></div>
        </div></div>`).join('') : '<div class="empty-cart"><span>♡</span><strong>Seu carrinho está vazio.</strong><p>Que tal escolher um brownie bem cremoso?</p></div>';
  }
  function setQuantity(id, n) {
    if (!products.some(p => p.id === id)) return;
    if (n <= 0) delete cart[id];
    else cart[id] = Math.min(99, n);
    persist(); updateCart();
  }
  function add(id) { setQuantity(id, (cart[id]||0)+1); toast('Brownie adicionado ao carrinho! ♡'); }

  const cartDrawer = $('#cartDrawer');
  const checkoutModal = $('#checkoutModal');
  const overlay = $('#overlay');
  function closeAll() {
    cartDrawer.classList.remove('open'); checkoutModal.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden','true'); checkoutModal.setAttribute('aria-hidden','true');
    cartDrawer.inert = true; checkoutModal.inert = true;
    overlay.hidden = true; document.body.classList.remove('modal-open');
  }
  function openPanel(panel) {
    closeAll(); overlay.hidden = false; document.body.classList.add('modal-open');
    panel.inert = false; panel.setAttribute('aria-hidden','false'); panel.classList.add('open');
    if (panel === cartDrawer) $('#closeCart').focus(); else $('#closeCheckout').focus();
  }

  // Calendário do negócio: Pernambuco (America/Recife) e prazo configurável.
  function plannedDelivery() {
    const dateParts = new Intl.DateTimeFormat('en-US', {
      timeZone:'America/Recife', year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'
    }).formatToParts(new Date());
    const o = Object.fromEntries(dateParts.map(x => [x.type,x.value]));
    const days = Number(o.hour) >= Number(cfg.horaLimite ?? 18) ? 2 : 1;
    const date = new Date(Date.UTC(Number(o.year),Number(o.month)-1,Number(o.day)+days,12));
    return new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC',weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'}).format(date);
  }

  function checkoutOpen() {
    if (!itemsCount()) { toast('Adicione um brownie antes de continuar.'); return; }
    $('#deliveryDate').textContent = plannedDelivery();
    $('#checkoutSubtotal').textContent = brl(subtotal());
    $('#checkoutShipping').textContent = validShipping ? (shipping === 0 ? 'Grátis' : brl(shipping)) : 'A combinar';
    $('#totalQualifier').textContent = validShipping ? '' : '(sem entrega)';
    $('#checkoutTotal').textContent = brl(subtotal()+(shipping||0));
    $('#pixPanel').hidden = true;
    $('#pixReady').hidden = true;
    $('#orderHelp').textContent = !whatsappValido
      ? 'Confira o número do WhatsApp da loja no arquivo config.js.'
      : whatsappOitoDigitos
        ? 'O WhatsApp da loja foi informado com 8 dígitos após o DDD. O site tentará abrir a conversa com o número informado; confirme que ele está cadastrado no WhatsApp.'
        : 'Você revisará a mensagem no WhatsApp antes de enviá-la.';
    openPanel(checkoutModal);
  }

  // EMV/BR Code do Pix: gerado LOCALMENTE, sem enviar a chave para serviços de terceiros.
  function field(tag, value) {
    const str = String(value);
    if (str.length > 99) throw Error(`Campo Pix muito longo: ${tag}`);
    return tag + String(str.length).padStart(2,'0') + str;
  }
  function ascii(s, max) {
    return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9 .-]/g,'').toUpperCase().trim().slice(0,max);
  }
  function crc16(s) {
    let crc = 0xFFFF;
    for (let i=0;i<s.length;i++) {
      crc ^= s.charCodeAt(i) << 8;
      for (let j=0;j<8;j++) crc = (crc & 0x8000) ? ((crc<<1)^0x1021) : (crc<<1);
      crc &= 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4,'0');
  }
  function pixPayload(amount) {
    const key = String(cfg.pixChave||'').trim();
    if (!key) throw Error('Chave Pix não configurada.');
    if (/[\u0000-\u001f]/.test(key)) throw Error('A chave Pix contém caracteres inválidos.');
    const name = ascii(cfg.pixNome,25) || 'DOCE MOMENTO';
    const city = ascii(cfg.pixCidade,15) || 'ARCOVERDE';
    const merchant = field('00','br.gov.bcb.pix')+field('01',key);
    const body = field('00','01')+field('26',merchant)+field('52','0000')+
      field('53','986')+field('54',Number(amount).toFixed(2))+field('58','BR')+
      field('59',name)+field('60',city)+field('62',field('05','***'))+'6304';
    return body+crc16(body);
  }
  function qrRender(value) {
    const qr = new window.QRMatrix(-1, 1); // correção de erros nível L
    qr.addData(value); qr.make();
    const n = qr.getModuleCount(), margin=4, size=n+2*margin;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',`0 0 ${size} ${size}`);
    svg.setAttribute('width','238'); svg.setAttribute('height','238');
    svg.setAttribute('role','img'); svg.setAttribute('aria-label','QR Code Pix');
    const bg = document.createElementNS('http://www.w3.org/2000/svg','rect');
    bg.setAttribute('width',size);bg.setAttribute('height',size);bg.setAttribute('fill','#fff');svg.appendChild(bg);
    let d='';
    for(let y=0;y<n;y++) for(let x=0;x<n;x++) if(qr.isDark(y,x)) d+=`M${x+margin} ${y+margin}h1v1h-1z`;
    const shape=document.createElementNS('http://www.w3.org/2000/svg','path');
    shape.setAttribute('d',d);shape.setAttribute('fill','#242124');svg.appendChild(shape);
    $('#pixQr').replaceChildren(svg);
  }

  function randomOrderCode() {
    const b = new Uint8Array(3);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(b);
    else for(let i=0;i<b.length;i++) b[i]=Math.floor(Math.random()*256);
    return 'DM-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+[...b].map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase();
  }
  function composeMessage(data) {
    const lines = products.filter(p => cart[p.id]).map(p => `• ${cart[p.id]}x ${p.nome} — ${brl(cart[p.id]*p.preco)}`);
    const address = `${data.rua}, ${data.numero}${data.complemento?', '+data.complemento:''} — ${data.bairro} — ${data.cidade||cfg.cidade||'Arcoverde - PE'}${data.cep?' · CEP '+data.cep:''}`;
    return [
      `🍫 *NOVA ENCOMENDA — ${cfg.nome||'Doce Momento'}*`,
      `Pedido: ${orderId}`,`Entrega prevista: ${plannedDelivery()}`,'',
      ...lines,'',`Produtos: ${brl(subtotal())}`,
      validShipping ? `Entrega: ${shipping===0?'Grátis':brl(shipping)}` : 'Entrega: taxa a confirmar',
      `*Total ${validShipping?'':'dos produtos '}: ${brl(subtotal()+(shipping||0))}*`,'',
      `👤 Nome: ${data.nome}`,`📱 WhatsApp: ${data.telefone}`,
      `📍 Endereço: ${address}`,
      data.observacoes ? `📝 Observações: ${data.observacoes}` : '', '',
      'Por favor, confirmem a disponibilidade, a entrega e os dados para pagamento. Obrigado!'
    ].filter(line => line !== null).join('\n');
  }

  // Busca de endereço pelo CEP via ViaCEP. Somente os 8 dígitos do CEP vão ao serviço,
  // nunca nome, telefone, número da casa ou complemento. Campos continuam editáveis.
  const cepInput = $('#cepInput');
  const cepStatus = $('#cepStatus');
  const addressForm = $('#orderForm');
  let cepAbort = null;
  let ultimoCepConsultado = '';
  const setCepStatus = (msg, status='') => {
    cepStatus.textContent = msg;
    cepStatus.dataset.status = status;
  };
  const cepDigits = () => cepInput.value.replace(/\D/g, '').slice(0,8);

  async function buscarCep() {
    const cep = cepDigits();
    if (cep.length !== 8 || cep === ultimoCepConsultado) return;
    ultimoCepConsultado = cep;
    cepAbort?.abort();
    const controller = new AbortController();
    cepAbort = controller;
    setCepStatus('Consultando o CEP...', 'busca');
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        signal:controller.signal, headers:{'Accept':'application/json'}
      });
      if (!response.ok) throw Error('Serviço indisponível');
      const data = await response.json();
      if (controller.signal.aborted || cepDigits() !== cep) return;
      if (data.erro === true || data.erro === 'true') {
        setCepStatus('CEP não encontrado. Verifique os números ou preencha manualmente.', 'erro');
        return;
      }
      if (typeof data.logradouro === 'string' && data.logradouro.trim()) addressForm.elements.rua.value = data.logradouro.trim();
      if (typeof data.bairro === 'string' && data.bairro.trim()) addressForm.elements.bairro.value = data.bairro.trim();
      if (typeof data.localidade === 'string' && data.localidade.trim()) {
        addressForm.elements.cidade.value = `${data.localidade.trim()}${data.uf ? ' - '+data.uf.trim() : ''}`;
      }
      setCepStatus('Endereço encontrado! Confira rua e bairro e informe o número da casa.', 'ok');
      addressForm.elements.numero.focus();
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (cepDigits() !== cep) return;
      ultimoCepConsultado = ''; // permite tentar novamente após falha de rede
      setCepStatus('Não foi possível buscar agora. Digite o endereço manualmente.', 'erro');
    }
  }

  cepInput.addEventListener('input', () => {
    const cep = cepDigits();
    cepInput.value = cep.length > 5 ? `${cep.slice(0,5)}-${cep.slice(5)}` : cep;
    if (cepAbort && cep.length !== 8) cepAbort.abort();
    if (cep !== ultimoCepConsultado) {
      ultimoCepConsultado = '';
      if (cep.length === 8) buscarCep();
      else setCepStatus(cep.length ? 'Complete os 8 dígitos do CEP.' : 'Digite o CEP para buscar rua, bairro e cidade automaticamente.');
    }
  });
  cepInput.addEventListener('blur', buscarCep);

  $('#productGrid').addEventListener('click', ev => {
    const addButton = ev.target.closest('[data-add]'); if (addButton) add(addButton.dataset.add);
  });
  $('#cartItems').addEventListener('click', ev => {
    const b = ev.target.closest('button'); if (!b) return;
    if (b.dataset.increase) setQuantity(b.dataset.increase,(cart[b.dataset.increase]||0)+1);
    if (b.dataset.decrease) setQuantity(b.dataset.decrease,(cart[b.dataset.decrease]||0)-1);
    if (b.dataset.remove) setQuantity(b.dataset.remove,0);
  });
  $('#openCart').addEventListener('click',() => openPanel(cartDrawer));
  $('#closeCart').addEventListener('click',closeAll);
  $('#closeCheckout').addEventListener('click',closeAll);
  overlay.addEventListener('click',closeAll);
  window.addEventListener('keydown',e => {if(e.key==='Escape'&&!overlay.hidden) closeAll();});
  $('#startCheckout').addEventListener('click',checkoutOpen);

  $('#orderForm').addEventListener('submit', ev => {
    ev.preventDefault();
    if (!itemsCount()) return toast('Seu carrinho está vazio.');
    const form = ev.currentTarget;
    if (!form.reportValidity()) return;
    if (!whatsappValido) {
      toast('Confira o número de WhatsApp configurado pela loja.');
      return;
    }
    const values = Object.fromEntries(new FormData(form).entries());
    orderId = randomOrderCode();
    const message = composeMessage(values);
    const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
    const win = window.open(link,'_blank');
    if (win) win.opener = null;
    else window.location.assign(link);
    $('#pixPanel').hidden = false;
    const canPix = Boolean(String(cfg.pixChave||'').trim()) && validShipping;
    $('#pixExplain').textContent = canPix
      ? 'Confira primeiro se a loja confirmou o pedido. O pagamento só deve ser feito após a confirmação pelo WhatsApp.'
      : !validShipping
        ? 'A taxa de entrega ainda precisa ser combinada com a loja pelo WhatsApp. Pague somente depois de receber o valor final e as instruções.'
        : 'A chave Pix da loja ainda não foi configurada. Solicite os dados pelo WhatsApp antes de pagar.';
    $('#pixReady').hidden = !canPix;
    if (canPix) {
      try {
        const amount = subtotal() + shipping;
        const payload = pixPayload(amount);
        $('#pixCode').value = payload;
        $('#pixAmount').textContent = brl(amount);
        qrRender(payload);
      } catch (err) {
        $('#pixReady').hidden = true;
        $('#pixExplain').textContent = 'Não foi possível gerar o Pix: ' + err.message + '. Confirme os dados com a loja pelo WhatsApp.';
      }
    }
    $('#orderHelp').textContent = `Pedido ${orderId} preparado. Confirme o envio da mensagem no WhatsApp; abrir a janela não significa que o pedido foi recebido.`;
    $('#pixPanel').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('#copyPix').addEventListener('click',async () => {
    const value = $('#pixCode').value;
    try { await navigator.clipboard.writeText(value); toast('Pix copiado! Confirme o pedido antes de pagar.'); }
    catch (_) { $('#pixCode').select(); toast('Selecione e copie o código Pix exibido.'); }
  });
  const menuButton = $('#menuButton');
  menuButton.addEventListener('click',()=> {
    const isOpen = $('#nav').classList.toggle('open'); menuButton.setAttribute('aria-expanded',String(isOpen));
  });
  $('#nav').addEventListener('click',e=>{if(e.target.closest('a')){$('#nav').classList.remove('open');menuButton.setAttribute('aria-expanded','false');}});
  $('#year').textContent = new Date().getFullYear();
  if (whatsappValido) {
    $('#contactWhats').replaceChildren(Object.assign(document.createElement('a'),{href:`https://wa.me/${whatsapp}`,target:'_blank',rel:'noopener noreferrer',textContent:whatsappOitoDigitos?'WhatsApp: +55 (87) 9130-9425 ↗':'Conversar pelo WhatsApp ↗'}));
  } else if (whatsapp) {
    $('#contactWhats').textContent = 'WhatsApp da loja: confira o número no config.js';
  }
  if (cfg.instagram) {
    const insta = String(cfg.instagram).replace(/^@/,'').replace(/[^a-zA-Z0-9._]/g,'');
    if (insta) $('#contactInsta').replaceChildren(Object.assign(document.createElement('a'),{href:`https://www.instagram.com/${insta}/`,target:'_blank',rel:'noopener noreferrer',textContent:'@'+insta}));
  }
  productsRender(); updateCart();
})();
