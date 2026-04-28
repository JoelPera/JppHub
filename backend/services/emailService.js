import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const SENDER = `${process.env.SENDER_NAME || 'JppHub'} <${process.env.SENDER_EMAIL || 'onboarding@resend.dev'}>`;
const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://jpphub.com';

function template({ title, greeting, bodyHtml, ctaLabel, ctaUrl, note }) {
  const noteHtml = note
    ? `
      <tr>
        <td style="padding:0 40px 24px">
          <div style="background:#F3F4F6;border-left:4px solid #0A0A0A;padding:16px;border-radius:6px;font-size:14px;color:#404040;line-height:1.6">
            <strong style="display:block;margin-bottom:4px;color:#0A0A0A">Nota del editor</strong>
            ${note}
          </div>
        </td>
      </tr>
    `
    : '';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
</head>

<body style="margin:0;padding:0;background:#FDFDFC;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;background:#FDFDFC">
<tr>
<td align="center">

<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden">

<tr>
<td style="padding:32px 40px 16px">
  <div style="width:40px;height:40px;background:#0A0A0A;border-radius:10px;color:#fff;text-align:center;line-height:40px;font-weight:700">J</div>
  <span style="font-weight:700;font-size:20px;margin-left:10px">JppHub</span>
</td>
</tr>

<tr>
<td style="padding:8px 40px 24px">
  <h1 style="margin:0 0 16px;font-size:26px">${title}</h1>
  <p style="margin:0 0 16px;color:#404040">${greeting}</p>
  ${bodyHtml}
</td>
</tr>

${noteHtml}

<tr>
<td style="padding:0 40px 40px">
  <a href="${ctaUrl}" style="background:#0A0A0A;color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;display:inline-block">
    ${ctaLabel} →
  </a>
</td>
</tr>

<tr>
<td style="padding:20px 40px;border-top:1px solid #E2E8F0;font-size:12px;color:#64748B">
  Gestiona tu cuenta en <a href="${BASE_URL}/dashboard">dashboard</a>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

export async function sendReviewNotification({ action, article, author, note }) {
  if (!resend || !author?.email) {
    console.log('[email] skipped (missing config)');
    return;
  }

  const firstName = (author.name || 'autor').split(' ')[0];

  const dashboardUrl = `${BASE_URL}/dashboard`;
  const publicUrl = article?.slug
    ? `${BASE_URL}/articulos/${article.slug}`
    : dashboardUrl;

  let subject = '';
  let html = '';

  if (action === 'approve') {
    subject = `🎉 Tu artículo "${article.title}" ha sido aprobado`;

    html = template({
      title: 'Artículo publicado',
      greeting: `Hola ${firstName},`,
      bodyHtml: `<p>Tu artículo <strong>${article.title}</strong> ya está publicado.</p>`,
      ctaLabel: 'Ver artículo',
      ctaUrl: publicUrl,
      note
    });
  }

  if (action === 'reject') {
    subject = `Tu artículo "${article.title}" no fue aprobado`;

    html = template({
      title: 'Artículo rechazado',
      greeting: `Hola ${firstName},`,
      bodyHtml: `<p>El artículo no cumple los criterios editoriales.</p>`,
      ctaLabel: 'Ir al dashboard',
      ctaUrl: dashboardUrl,
      note
    });
  }

  if (action === 'review' || action === 'request_changes') {
    subject = `Cambios requeridos en "${article.title}"`;

    html = template({
      title: 'Revisar artículo',
      greeting: `Hola ${firstName},`,
      bodyHtml: `<p>Necesitamos cambios en tu artículo.</p>`,
      ctaLabel: 'Editar artículo',
      ctaUrl: dashboardUrl,
      note
    });
  }

  try {
    const r = await resend.emails.send({
      from: SENDER,
      to: author.email,
      subject,
      html
    });

    console.log('[email] sent:', r?.id || 'ok');
    return r;
  } catch (err) {
    console.error('[email] error:', err?.message || err);
  }
}

export default { sendReviewNotification };
