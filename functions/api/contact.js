// Redireciona GET diretamente para o formulário
export const onRequestGet = () => Response.redirect("/contacto.html", 302);

export const onRequestPost = async (context) => {
  const { request, env, waitUntil } = context;

  try {
    const form = await request.formData();

    // Campos
    const nome = form.get("nome") || "";
    const email = form.get("email") || "";
    const telefone = form.get("telefone") || "";
    const mensagem = form.get("mensagem") || "";

    // Anti‑spam
    const hp = form.get("hp") || "";
    const loadTime = Number(form.get("load_time") || 0);

    // Se for bot (honeypot) ou demasiado rápido, redireciona logo para obrigado
    if (hp || !Number.isFinite(loadTime) || Date.now() - loadTime < 3000) {
      return Response.redirect("/obrigado.html", 302);
    }

    // Destinatários/assunto (com variáveis de ambiente opcionais)
    const to = env.CONTACT_TO || "geral@jspalgarve.pt";
    const from =
      env.CONTACT_FROM || `no-reply@${new URL(request.url).hostname}`;
    const subject =
      env.CONTACT_SUBJECT || "[Site JSP Algarve] Novo pedido de contacto";

    const content = `
Nome: ${nome}
Email: ${email}
Telefone: ${telefone}

Mensagem:
${mensagem}
`.trim();

    // Payload MailChannels
    const mailReq = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: "Website JSP Algarve" },
      subject,
      content: [{ type: "text/plain; charset=utf-8", value: content }],
    };

    // Envio em background: não bloqueia a resposta nem faz explodir a função
    waitUntil(
      fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(mailReq),
      }).catch(() => {
        // Ignora falhas do canal de e-mail para não afetar UX
      })
    );

    // Redireciona SEMPRE, independentemente do resultado do envio
    return Response.redirect("/obrigado.html", 302);
  } catch {
    // Em caso de erro inesperado no parse do form, etc., também redireciona
    return Response.redirect("/obrigado.html", 302);
  }
};
