import { useRef, useState } from "react"
import { MdAddPhotoAlternate, MdAddAPhoto  } from "react-icons/md"; 
import { FaRegFileImage } from "react-icons/fa";
import { openCamera, capturePhoto } from "../../utils/cameraUtils";

const FormRegistro = () => {
	// const [ file, setFile ] = useState(null);
	const [ imagePreview, setImagePreview ] = useState(null);
	const [ showOptions, setShowOptions ] = useState(null);
	// const [ imagePreview, setImagePreview ] = useState(null);
	const [ isCameraOpen, setIsCameraOpen ] = useState(false);

	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	
	const toggleOptions = () =>{
		setShowOptions((prev) => !prev)
	}
	const closeCamera = () =>{
		if(videoRef.current){
			const stream = videoRef.current.srcObject;
			const tracks = stream.getTracks();
			tracks.forEach((track) => track.stop());
		}

		setIsCameraOpen(false);
	}
	return (
		<>
			<form 
				className="border p-3 grid gap-5 justify-center">
				<div 
				className="grid grid-cols-3 gap-6 relative">
					<div 
					className="grid grid-rows-3 ">
						<button
						type="button"
							className="w-3/4 h-3/4 m-auto cursor-pointer row-span-2"
							onClick={toggleOptions}>
							{imagePreview ? (
								<img 
								src={imagePreview} 
								alt="preview"
								className="w-full h-full object-cover rounded-lg" />
							) : (
								<MdAddPhotoAlternate 
								className="w-full h-full text-gray-300 hover:text-gray-500" />
							)}
							

						</button>
						<button
							type="button"
							className="text-center text-3xl w-48  font-extrabold  justify-center "
							>
							<p className="flex gap-1 absolut justify-center">
								$
								<input
								className="w-28 text-center rounded"
								type="text"
								placeholder="200.00"
								disabled />
							</p>
							
							<p className="text-sm py-2 text-gray-500 hover:text-gray-600">Presiona para calcular total</p>
						</button>
						{/* Opcion para cargar imagen */}
						{showOptions && (
						<div 
							className="absolute top-1/2 mt-2 bg-white border rounded-lg shadow-lg w-48 z-10">

							<ul className="flex flex-col">
								<li className="hover:bg-gray-100 px-4 py-2 cursor-pointer ">
									<label htmlFor="upload-photo" className="cursor-pointer flex gap-4 items-center">
									<FaRegFileImage  />
									Subir Foto
									</label>
									<input
									id="upload-photo"
									type="file"
									accept="image/*"
									className="hidden"
									onChange={() => {
									// handleFileChange(e);
									setShowOptions(false); // Oculta las opciones después de seleccionar
									}}
									/>
								</li>
								<li 
									className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex gap-4 items-center">
									<MdAddAPhoto />
									<button
									type="button"
									onClick={() => {
									openCamera(videoRef, setIsCameraOpen);
									setShowOptions(false); // Oculta las opciones después
									}}
									>
									Tomar Foto
									</button>
								</li>
							</ul>
						</div>
						)}
					</div>
					
					{isCameraOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-20">
							<video ref={videoRef} className="w-full max-w-md h-auto bg-black" />
								<div className="flex gap-4 mt-4">
									<button
										type="button"
										className="px-4 py-2 bg-red-500 text-white rounded"
										onClick={closeCamera}
									>
									Cerrar Cámara
									</button>
									<button
										type="button"
										className="px-4 py-2 bg-green-500 text-white rounded"
										onClick={capturePhoto(videoRef, canvasRef, setImagePreview,  setIsCameraOpen)}
									>
									Capturar Foto
									</button>
								</div>
							<canvas ref={canvasRef} className="hidden"></canvas>
						</div>
					)}
				
					<div className="col-span-2 grid gap-2 grid-cols-2">
						<div className=" grid col-span-2">
							<label className=" p-1 font-bold">
							Nombre
							</label>
							<input 
							className="border p-2 rounded-lg"
							type="text"
							
							placeholder="ejm: Proteina en polvo" />
						</div>
						<div className=" grid col-span-2 ">
							<label className=" p-1 font-bold">
							Marca
							</label>
							<input 
							className="border p-2 rounded-lg"
							type="text"
							
							placeholder="ejm: DragonPharma" />
							
						</div>
						<div className=" grid ">
							<label className=" p-1 font-bold">
							Categoria
							</label>
							<input 
							className="border p-2 rounded-lg"
							type="text"
							
							placeholder="ejm: Proteina" />
						</div>
						
						<div className=" grid ">
							<label className=" p-1 font-bold">
							Stock
							</label>
							<input 
							className="border p-2 rounded-lg"
							placeholder="ejm: 50"
							type="number" />
						</div>
						<div className=" grid">
							<label className=" p-1 font-bold">
							Precio
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
								<input
									className="border p-2 pl-8 rounded-lg w-full"
									type="number"
									placeholder="ejm: 300.00"
								/>
							</div>
							
						</div>
						
						<div className=" grid">
							<label className=" p-1 font-bold">
							Descuento
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
								<input
									className="border p-2 pl-8 rounded-lg w-full"
									type="number"
									placeholder="ejm: 100.00"
								/>
							</div>
							
						</div>
						<div className=" grid col-span-2">
							<label className=" p-1 font-bold">
							Descripcion
							</label>
							<textarea
								className="border p-2 rounded-lg w-full resize-none"
								placeholder="Escribe tu descripcion aquí..."
								rows="4"
							></textarea>
						</div>
						
					</div>
				</div>
				<button 
					className="button w-32 m-auto">
						Guardar
				</button>
			</form>
		</>
	)
}

export default FormRegistro