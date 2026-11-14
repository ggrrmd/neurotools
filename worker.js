// Neurotools: o site é servido como arquivos estáticos (pasta do repositório).
// Este worker só responde a POST /api/contato: confere a sessão do Supabase e envia a
// mensagem de contato por email (Resend) para o endereço do projeto.
// Precisa do segredo RESEND_API_KEY no Cloudflare (Workers & Pages > neurotools > Settings > Variables and Secrets).
// Sem o segredo, responde 503 e o site oferece abrir o programa de email do usuário.

const SUPABASE_URL = 'https://alxkympzfvjhrmbpuzfh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gUMCRKJfftipcrHoItN2iw_kbgPlG_J'; // chave pública (a mesma do index.html)
const DESTINO = 'neurotools.contato@gmail.com';
const REMETENTE = 'Neurotools <nao-responda@neurotools.com.br>';
const TIPOS = ['Problema', 'Sugestão', 'Outro assunto'];
const LIMITE_HORA = 5; // mensagens por conta por hora (por instância do worker)
const recentes = new Map();

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function limpa(v, max) { return String(v == null ? '' : v).replace(/\r/g, '').slice(0, max); }

async function contato(request, env) {
  if (request.method !== 'POST') return json(405, { erro: 'método' });
  if (!env.RESEND_API_KEY) return json(503, { erro: 'envio não configurado' });
  const origem = request.headers.get('Origin') || '';
  if (origem && new URL(origem).host !== new URL(request.url).host) return json(403, { erro: 'origem' });

  const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return json(401, { erro: 'sessão' });
  const u = await fetch(SUPABASE_URL + '/auth/v1/user', { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + token } });
  if (!u.ok) return json(401, { erro: 'sessão' });
  const user = await u.json();
  const email = user && user.email;
  if (!email) return json(401, { erro: 'sessão' });

  const agora = Date.now(), lista = (recentes.get(email) || []).filter(t => agora - t < 3600e3);
  if (lista.length >= LIMITE_HORA) return json(429, { erro: 'muitas mensagens' });

  let corpo;
  try { corpo = await request.json(); } catch (e) { return json(400, { erro: 'formato' }); }
  const tipo = TIPOS.includes(corpo.tipo) ? corpo.tipo : 'Outro assunto';
  const msg = limpa(corpo.mensagem, 5000).trim();
  if (msg.length < 5) return json(400, { erro: 'mensagem vazia' });
  const nome = limpa(user.user_metadata && user.user_metadata.nome, 120);

  const texto = [
    msg, '', '---',
    'De: ' + (nome ? nome + ' <' + email + '>' : email),
    'Versão: ' + limpa(corpo.versao, 20),
    'Página: ' + limpa(corpo.pagina, 120),
    'Navegador: ' + limpa(corpo.navegador, 300)
  ].join('\n');

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: REMETENTE, to: [DESTINO], reply_to: email, subject: 'Neurotools: ' + tipo + ' (' + (nome || email) + ')', text: texto })
  });
  if (!r.ok) return json(502, { erro: 'falha no envio' });
  lista.push(agora); recentes.set(email, lista);
  return json(200, { ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/contato') {
      try { return await contato(request, env); } catch (e) { return json(500, { erro: 'interno' }); }
    }
    return env.ASSETS.fetch(request);
  }
};
