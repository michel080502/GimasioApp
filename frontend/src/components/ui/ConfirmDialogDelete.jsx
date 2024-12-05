import PropTypes from 'prop-types'
const ConfirmDialogDelete = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="absolute right-3 mt-2 bg-white border rounded-lg shadow-lg w-56 z-10 p-4">
    <h1 className="text-lg font-semibold text-gray-700 mb-2">{message}</h1>
    <div className="flex justify-between">
      <button
        className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-gray-300"
        onClick={onCancel}
      >
        Cancelar
      </button>
      <button
        className="bg-rose-500 text-white py-1 px-3 rounded hover:bg-rose-600"
        onClick={onConfirm}
      >
        Confirmar
      </button>
    </div>
  </div>
  )
}

ConfirmDialogDelete.propTypes = {
    message: PropTypes.string,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
}

export default ConfirmDialogDelete
