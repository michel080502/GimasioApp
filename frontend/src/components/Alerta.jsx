import PropTypes from 'prop-types'

function Alerta({alerta}) {
	return (
		<p className={`absolute left-1/2 transform -translate-x-1/2 duration-150 font-bold px-3 py-1 z-10 rounded shadow-md ${alerta.error ? 'bg-red-100 text-red-700 shadow-red-300' : 'bg-green-100 text-green-700 shadow-green-300'} `}>
          ¡{alerta.msg}!
        </p>
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
