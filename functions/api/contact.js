export const onRequestPost = async ({ request, env }) => {
  try {
    const form = await request.formData();
    const nome = form.get('nome') || '';
    const email = form.get('email') || '';
    const telefone = form.get('telefone') || '';
    const mensagem = form.get('mensagem') || '';
    const hp = form.get('hp') || '';
    const loadTime = Number(form.get('load_time') || 0);
    if (hp) return new Response('OK',{status:200});
    if (!loadTime || (Date.now()-loadTime)<3000) return new Response('OK',{status:200});
    const to = env.CONTACT_TO || 'geral@jspalgarve.pt';
    const from = env.CONTACT_FROM || `no-reply@${new URL(request.url).hostname}`;
    const subject = env.CONTACT_SUBJECT || '[Site JSP Algarve] Novo pedido de contacto';
    const content = `Nome: ${nome}
Email: ${email}
Telefone: ${telefone}
Mensagem:
${mensagem}`;
    const mailReq = {personalizations:[{to:[{email:to}]}],from:{email:from,name:'Website JSP Algarve'},subject,content:[{type:'text/plain; charset=utf-8',value:content}]};
    await fetch('https://api.mailchannels.net/tx/v1/send',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(mailReq)});
    const next = form.get('_next') || '/obrigado.html';
    return Response.redirect(next,302);
  } catch(e){
    return Response.redirect('/obrigado.html',302);
  }
};
