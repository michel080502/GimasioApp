import PropTypes from 'prop-types'

function Alerta({alerta}) {
	return (
		<div className={`${alerta.error ? 'from-red-400 to-red-600' : 'from-green-400 to-green-600'} m-auto bg-gradient-to-r p-1 text-center uppercase text-white font-bold  rounded-xl text-sm`}>
			{alerta.msg}
		</div>
	)
}

// Aqui definimos los tipos de valores que recibira la alerta, aqui verificara que alerta contiene un mensaje tipo string
Alerta.propTypes = {
	alerta: PropTypes.shape({
		msg: PropTypes.string.isRequired,
		error: PropTypes.bool.isRequired
	}).isRequired,
};
export default Alerta;
