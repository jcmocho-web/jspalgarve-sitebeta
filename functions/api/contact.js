export const onRequestPost = async ({ request, env }) => {
  try {
    const form = await request.formData();

    const nome = form.get("nome") || "";
    const email = form.get("email") || "";
    const telefone = form.get("telefone") || "";
    const mensagem = form.get("mensagem") || "";
    const hp = form.get("hp") || "";
    const loadTime = Number(form.get("load_time") || 0);

    // Honeypot — se o bot preencher, ignora
    if (hp) return new Response("OK", { status: 200 });

    // CAPTCHA invisível — mínimo 3 segundos na página
    if (Date.now() - loadTime < 3000) {
      return new Response("OK", { status: 200 });
    }

    // Destino do email
    const to = env.CONTACT_TO || "geral@jspalgarve.pt";

    // From: pode ser ambiente ou fallback dinâmico
    const from =
      env.CONTACT_FROM ||
      `no-reply@${new URL(request.url).hostname}`;

    const subject =
      env.CONTACT_SUBJECT ||
      "[Site JSP Algarve] Novo pedido de contacto";

    const content = `
Nome: ${nome}
Email: ${email}
Telefone: ${telefone}

Mensagem:
${mensagem}
    `.trim();

    // Objeto MailChannels — AGORA SEM ERROS DE JSON
    const mailReq = {
      personalizations: [
        {
          to: [{ email: to }]
        }
      ],
      from: {
        email: from,
        name: "Website JSP Algarve"
      },
      subject: subject,
      content: [
        {
          type: "text/plain; charset=utf-8",
          value: content
        }
      ]
    };

    // Enviar email via MailChannels
    await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(mailReq)
    });

    // Redirecionar sempre para a página de obrigado
    return Response.redirect("/obrigado.html", 302);
  } catch (err) {
    return Response.redirect("/obrigado.html", 302);
  }
};
