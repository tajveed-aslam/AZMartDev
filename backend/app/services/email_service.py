import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings


def _format_pkr(amount: float) -> str:
    return f"PKR {amount:,.0f}"


def _build_email_html(order, items) -> str:
    rows = "".join(
        f"<tr><td style='padding:8px 12px;border-bottom:1px solid #f1f5f9'>{i.product_name}</td>"
        f"<td style='padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:center'>{i.quantity}</td>"
        f"<td style='padding:8px 12px;border-bottom:1px solid #f1f5f9;text-align:right'>{_format_pkr(i.unit_price * i.quantity)}</td></tr>"
        for i in items
    )
    return f"""
<html><body style="font-family:Inter,system-ui,sans-serif;background:#f1f5f9;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(79,70,229,.1)">
  <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px 32px">
    <h1 style="color:#fff;margin:0;font-size:20px">New Order Received!</h1>
    <p style="color:#c7d2fe;margin:4px 0 0;font-size:14px">A&amp;Z Mart — Order #{order.id}</p>
  </div>
  <div style="padding:24px 32px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
      <tr style="background:#f8fafc">
        <th style="padding:8px 12px;text-align:left;font-size:12px;color:#64748b;font-weight:600">ITEM</th>
        <th style="padding:8px 12px;text-align:center;font-size:12px;color:#64748b;font-weight:600">QTY</th>
        <th style="padding:8px 12px;text-align:right;font-size:12px;color:#64748b;font-weight:600">AMOUNT</th>
      </tr>
      {rows}
    </table>
    <div style="background:#f8fafc;border-radius:12px;padding:16px;display:flex;justify-content:space-between">
      <span style="font-weight:700;color:#1e293b">Total</span>
      <span style="font-weight:800;color:#4f46e5;font-size:18px">{_format_pkr(order.total_amount)}</span>
    </div>
    <div style="margin-top:20px;padding:16px;border:1px solid #e2e8f0;border-radius:12px">
      <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600">DELIVERY DETAILS</p>
      <p style="margin:4px 0;font-size:14px;color:#1e293b"><strong>{order.full_name}</strong> · {order.phone}</p>
      <p style="margin:4px 0;font-size:14px;color:#475569">{order.address}, {order.city}</p>
      {"<p style='margin:4px 0;font-size:13px;color:#94a3b8'>Note: " + str(order.notes) + "</p>" if order.notes else ""}
    </div>
    <div style="margin-top:16px;text-align:center">
      <a href="http://localhost:3000/admin/orders" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px">
        View in Admin Panel →
      </a>
    </div>
  </div>
  <div style="padding:16px 32px;background:#f8fafc;text-align:center">
    <p style="margin:0;font-size:12px;color:#94a3b8">A&amp;Z Mart — Cash on Delivery</p>
  </div>
</div>
</body></html>
"""


def _send_sync(order, items) -> None:
    if not settings.seller_email or not settings.smtp_user or not settings.smtp_pass:
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"New Order #{order.id} — A&Z Mart"
    msg["From"] = settings.smtp_user
    msg["To"] = settings.seller_email
    msg.attach(MIMEText(_build_email_html(order, items), "html"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as smtp:
        smtp.starttls()
        smtp.login(settings.smtp_user, settings.smtp_pass)
        smtp.sendmail(settings.smtp_user, settings.seller_email, msg.as_string())


async def send_order_notification(order, items) -> None:
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, _send_sync, order, items)
    except Exception:
        pass  # never crash the request if email fails
