import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SENDER = `${process.env.SENDER_NAME || 'JppHub'} <${process.env.SENDER_EMAIL || 'onboarding@resend.dev'}>`;
const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://jpphub.com';

function template({ title, greeting, bodyHtml, ctaLabel, ctaUrl, note }) {
    const noteHtml = note
        ? `<tr><td style="padding:0 40px 24px"><div style="background:#F3F4F6;border-left:4px solid #0A0A0A;padding:16px;border-radius:6px;font-size:14px;color:#404040;line-height:1.6"><strong style="display:block;margin-bottom:4px;color:#0A0A0A">Nota del editor</strong>${note.replace(/\n/g, '<br/>')}</div></td></tr>`
        : '';
    return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#FDFDFC;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDFDFC;padding:40px 20px">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;overflow:hidden">
      <tr><td style="padding:32px 40px 16px">
        <div style="display:inline-block;width:40px;height:40px;background:#0A0A0A;border-radius:10px;color:#fff;text-align:center;line-height:40px;font-weight:700;font-size:20px">J</div>
        <span style="font-weight:700;font-size:20px;color:#0A0A0A;margin-left:10px;vertical-align:middle">JppHub</span>
      </td></tr>
      <tr><td style="padding:8px 40px 24px">
        <h1 style="font-size:28px;font-weight:700;color:#0A0A0A;margin:0 0 16px;line-height:1.2">${title}</h1>
        <p style="font-size:16px;color:#404040;line-height:1.6;margin:0 0 8px">${greeting}</p>
        ${bodyHtml}
      </td></tr>
      ${noteHtml}
      <tr><td style="padding:0 40px 40px">
        <a href="${ctaUrl}" style="display:inline-block;background:#0A0A0A;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600;font-size:15px">${ctaLabel} →</a>
      </td></tr>
      <tr><td style="padding:24px 40px;border-top:1px solid #E2E8F0;background:#FDFDFC">
        <p style="font-size:12px;color:#64748B;margin:0;line-height:1.6">Recibes este email porque publicas en JppHub. Puedes gestionar tus preferencias desde tu <a href="${BASE_URL}/dashboard" style="color:#2563EB">dashboard</a>.</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

export async function sendReviewNotification({ action, article, author, note, reviewerName }) {
    if (!resend || !author?.email) {
        console.log('[email] skipped (no resend key or no author email)');
        return null;
    }

    const firstName = (author.name || 'autor').split(' ')[0];
    let subject, html;
    const dashboardUrl = `${BASE_URL}/dashboard`;
    const publicUrl = article?.slug ? `${BASE_URL}/articulos/${article.slug}` : dashboardUrl;

    if (action === 'approve') {
        subject = `🎉 Tu artículo "${article.title}" ha sido aprobado`;
        html = template({
            title: '¡Tu artículo está publicado!',
            greeting: `Hola ${firstName},`,
            bodyHtml: `<p style="font-size:16px;color:#404040;line-height:1.6;margin:0 0 16px">Hemos aprobado tu artículo <strong>"${article.title}"</strong>. Ya está visible en la home de JppHub y compartible con tus lectores.</p>`,
            ctaLabel: 'Ver artículo publicado',
            ctaUrl: publicUrl,
            note
        });
    } else if (action === 'reject') {
        subject = `Tu artículo "${article.title}" no fue aprobado`;
        html = template({
            title: 'Tu artículo no fue aprobado',
            greeting: `Hola ${firstName},`,
            bodyHtml: `<p style="font-size:16px;color:#404040;line-height:1.6;margin:0 0 16px">Revisamos <strong>"${article.title}"</strong> y no cumple con nuestro criterio editorial. No es un rechazo de ti, solo de este artículo. Puedes enviar uno nuevo cuando quieras.</p>`,
            ctaLabel: 'Ir al dashboard',
            ctaUrl: dashboardUrl,
            note
        });
    } else if (action === 'review' || action === 'request_changes') {
        subject = `Pedimos cambios en "${article.title}"`;
        html = template({
            title: 'Necesitamos algunos cambios',
            greeting: `Hola ${firstName},`,
            bodyHtml: `<p style="font-size:16px;color:#404040;line-height:1.6;margin:0 0 16px">Casi está. Hay algunos ajustes que creemos harán mejor <strong>"${article.title}"</strong>. Échale un ojo a la nota, edita el artículo y reenvíalo — nosotros lo volvemos a revisar.</p>`,
            ctaLabel: 'Editar artículo',
            ctaUrl: dashboardUrl,
            note
        });
    } else {
        return null;
    }

    try {
        const r = await resend.emails.send({
            from: SENDER,
            to: [author.email],
            subject,
            html
        });
        console.log(`[email] sent to ${author.email} (action=${action}, id=${r?.data?.id || r?.id || 'unknown'})`);
        return r;
    } catch (err) {
        console.error(`[email] FAILED to send (${action}):`, err?.message || err);
        return null;
    }
}

export default { sendReviewNotification };
