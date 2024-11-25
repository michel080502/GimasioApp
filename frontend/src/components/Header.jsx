import { FaMoneyCheck } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import PropTypes from 'prop-types';

const Header = ({ admin }) => {
	
	return (
	<div className='flex justify-between  bg-zinc-900 text-white'>
		<h1 className='p-4 text-3xl font-semibold'>Buenos días, <span className='font-bold'>{`${admin.nombre}`}</span></h1>
		<div className=' flex font-semibold text-xl items-center'>
			<button className=' button-header '> <FaShop /> Punto de venta</button>
			<button className=' button-header '> <FaMoneyCheck /> Check - in</button>
		</div>
	</div> 
	);
};

Header.propTypes = {
	admin: PropTypes.shape({
		nombre: PropTypes.string.isRequired,
	}).isRequired,
};

export default Header;
