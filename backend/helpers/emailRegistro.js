import nodemailer from "nodemailer"

const emailRegistro = async (datos) =>{
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
		subject: 'Confirma tu cuenta en Gym Spartans',
		text: 'Confirma tu cuenta en Gym Spartans',
		html: `
		<p>Hola: ${nombre}, comprueba tu cuenta en Gym Spartan para poder administrarlo</p>
		<p>Tu cuenta ya casi está lista, solo debes comprobar que es tuya ingresando al siguiente enlace: <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
		<p>Si no creaste esta cuenta, puedes ignorar este mensaje</p>
		`,
	});

};

export default emailRegistro;