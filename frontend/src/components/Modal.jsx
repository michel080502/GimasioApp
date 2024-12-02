import PropTypes from 'prop-types'
const Modal = ({closeModal, children}) =>{
	return (
	<div className="overlay" onClick={closeModal}>
		<div className="modal" onClick={(e) => e.stopPropagation()}>
			{children}
		</div>
	</div>
	)
}
	Modal.propTypes = {
	closeModal: PropTypes.func.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node, // Esto permite texto o JSX
	]).isRequired,
	}

export default Modal