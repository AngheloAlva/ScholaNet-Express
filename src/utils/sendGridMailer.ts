import sgMail from '@sendgrid/mail'
import { envs } from '../config/envs'

sgMail.setApiKey(envs.SENDGRID_API_KEY)

export async function sendEmail (to: string, subject: string, text: string, html: string): Promise<any> {
  const msg = {
    to,
    from: 'scholanet.contact@gmail.com',
    subject,
    text,
    html
  }

  try {
    await sgMail.send(msg)
  } catch (error) {
    throw new Error(`Error sending email: ${error as string}`)
  }
}
