
JSP Algarve – Deploy (Cloudflare Pages)

- Faça upload deste ZIP no Cloudflare Pages (Create project → Upload).
- As Pages Functions (pasta `functions/api/contact.js`) enviam email via MailChannels.
- Opcional: em Settings → Environment Variables, defina:
  - CONTACT_TO=geral@jspalgarve.pt
  - CONTACT_FROM=no-reply@jspalgarve.pt
  - CONTACT_SUBJECT=[Site JSP Algarve] Novo pedido de contacto
