import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
	// esto nos crea JSONWEBTOKEN, proporcionando dos variables y cuando expira
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "1d"
	});
};

export default generarJWT;