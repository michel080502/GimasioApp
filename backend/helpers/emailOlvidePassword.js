import nodemailer from "nodemailer"

const emailOlvidePassword = async (datos) =>{
	// Looking to send emails in production? Check out our Email API/SMTP product!
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});

	// Enviar el email
	const { email, nombre, token } = datos;

	const info = await transport.sendMail({
		from: "Gym Spartans",
		to: email,
		subject: 'Reestablece tu password',
		text: 'Reestablece tu password',
		html: `
		<p>Hola: ${nombre}, reestablece tus password</p>
		<p>Para reestablecer tu password ingresa al siguiente enlace: <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer</a></p>
		<p>Si no pediste este cambio, puedes ignorar este mensaje</p>
		`,
	});

};

export default emailOlvidePassword;