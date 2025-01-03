import { FaMoneyCheck } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import PropTypes from 'prop-types';

const Header = ({ admin }) => {
	
	return (
	<div className=' hidden md:flex justify-between  bg-zinc-900 '>
		<h1 className=' text-white p-4 text-3xl font-semibold'>Buenos días, <span className='font-bold'>{`${admin.nombre}`}</span></h1>
		<div className=' flex font-semibold text-xl items-center gap-4 px-5 divide-x'>
			<button className='  flex gap-2 items-center p-1 text-white text-opacity-50 hover:text-opacity-100 '> <FaShop /> Punto de venta</button>
			<button className='  flex gap-2 items-center p-2 text-white text-opacity-50 hover:text-opacity-100 '> <FaMoneyCheck /> Check - in</button>
		</div>
	</div> 
	)
};

Header.propTypes = {
	admin: PropTypes.shape({
		nombre: PropTypes.string.isRequired,
	}).isRequired,
};

export default Header;
