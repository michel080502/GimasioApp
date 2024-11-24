import { VscDebugBreakpointUnsupported } from "react-icons/vsc";
import { CgEditBlackPoint } from "react-icons/cg";
import { TbPointFilled } from "react-icons/tb";
import { MdSell } from "react-icons/md";
const CardInforme = () => {
  return (
	<>
	<div className="p-2 bg-white rounded-md shadow-lg shadow-gray-500/50 col-span-2">
        <div className="p-2 border-b-2 border-red-700 text-lg font-semibold flex justify-between items-center">
			<h1>Informe de stock de productos</h1>
			<MdSell />
        </div>

        <div className="grid grid-cols-3">
			<div className="py-3 border-r-2 text-center items-center  font-semibold">
				<h2 className="text-3xl">34</h2>
				<p className="flex justify-center gap-2 items-center text-green-600 p-1"> < CgEditBlackPoint  className="text-2xl" />  suficiente stock</p>
			</div>
			<div className="py-3 border-r-2 text-center items-center  font-semibold">
				<h2 className="text-3xl">34</h2>
				<p className="flex justify-center gap-2 items-center text-orange-600 p-1"> <VscDebugBreakpointUnsupported className="text-2xl" />  stock medio</p>
			</div>
			<div className="py-3  text-center items-center  font-semibold">
				<h2 className="text-3xl">34</h2>
				<p className="flex justify-center gap-2 items-center text-red-800 p-1"> <TbPointFilled className="text-2xl" /> sin stock</p>
			</div>
			
        </div>

		
    </div>
	<div className="bg-white rounded-md p-3 shadow-lg shadow-gray-500/50">
		<h1 className="text-2xl p-2 border-b-2 border-red-700 ">Total Productos</h1>
		<div className="text-right p-2">
			<h2 className="text-4xl font-bold">300</h2>
			<p>productos en sistema</p>
		</div>
		
	</div>
	</>
  )
}

export default CardInforme