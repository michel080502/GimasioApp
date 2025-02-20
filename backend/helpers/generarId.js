const generarId = () => {
	// Manera de generar un ID unico seguro
	return Date.now().toString(32) + Math.random().toString(32).substring(2);
};

export default generarId;