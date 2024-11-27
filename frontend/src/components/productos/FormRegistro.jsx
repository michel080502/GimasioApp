import { useState } from "react"
import { MdAddPhotoAlternate, MdAddAPhoto  } from "react-icons/md"; 
import { FaRegFileImage } from "react-icons/fa";
import Alerta from "../Alerta";
import Camera from "../ui/Camera";
const FormRegistro = () => {
	const [ nombre, setNombre ] = useState("");
	const [ marca, setMarca ] = useState("");
	const [ categoria, setCategoria ] = useState("");
	const [ stock, setStock ] = useState(0);
	const [ precio, setPrecio ] = useState(0.00);
	const [ descuento, setDescuento ] = useState(0.00);
	const [ descripcion, setDescripcion ] = useState("");
	const [ total, setTotal ] = useState(0.00);

	const [ file, setFile ] = useState(null);
	const [ alerta, setAlerta ] = useState({msg: "", error:false});

	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [ imagePreview, setImagePreview ] = useState(null);
	const [ showOptions, setShowOptions ] = useState(null);

	const handleSubmit =  (e) =>{
		e.preventDefault();
		if(file == null){
			setAlerta({msg: "Por favor selecciona imagen", error: true});
			return;
		}
		if([nombre, marca, categoria, descripcion].includes('') ){
			setAlerta({msg: "Por completa campos faltantes", error: true});
			return;
		}

		if([stock, precio, descuento, total] == 0) {
			setAlerta({msg: "Por ingresa el total", error: true});
			return;
		}
		
		setAlerta({msg: 'Ok', error:false})
	}
	const generarTotal = () =>{
		if(precio && descuento != 0){
			const suma = precio - descuento;
			setTotal(suma);
		} else {
			setAlerta({msg: 'Necesitas precio y descuento', error: true})
		}
	}
	
	const toggleOptions = () => {
		setShowOptions((prev) => !prev);
	};

	const resizeImage = (file, size = 300) =>{
		return new Promise((resolve, reject) =>{
			const img = new Image();
			const reader = new FileReader();
			reader.onload = (e) => {
				img.src = e.target.result;
			};

			reader.readAsDataURL(file);

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
	
				// Configura el tamaño del canvas
				canvas.width = size;
				canvas.height = size;
	
				// Escala la imagen y centra
				const scale = Math.max(size / img.width, size / img.height);
				const x = (size - img.width * scale) / 2;
				const y = (size - img.height * scale) / 2;
	
				// Rellena el fondo (opcional)
				ctx.fillStyle = "#FFF";
				ctx.fillRect(0, 0, size, size);
	
				// Dibuja la imagen redimensionada y centrada
				ctx.drawImage(
					img,
					0,
					0,
					img.width,
					img.height,
					x,
					y,
					img.width * scale,
					img.height * scale
				);
	
				// Convierte a blob para enviar al backend
				canvas.toBlob(
					(blob) => resolve(blob),
					"image/jpeg",
					0.8 // Calidad de compresión
				);

			};
	
			img.onerror = (err) => reject(err);
		})
	}

	const handleCapture = (imageData) => {
		setImagePreview(imageData);
		setFile(imageData)
		setIsCameraOpen(false); // Cierra la cámara después de capturar
	};
	
	const handleFileChange = async (e) =>{
		const selectedFile = e.target.files[0];
		if(selectedFile){
			try {
				// Redimensiona la imagen y guarda el resultado
				const resizedImage = await resizeImage(selectedFile);
				setFile(resizedImage);
		
				// Genera una vista previa
				const reader = new FileReader();
				reader.onload = () => setImagePreview(reader.result);
				reader.readAsDataURL(resizedImage);
			} catch (err) {
				console.error("Error al procesar la imagen:", err);
			}
		}
	};

	const {msg} = alerta;
	
	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="border p-3 grid gap-5 justify-center">
				{msg && (
					<Alerta alerta={alerta} />
				)}
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
							onClick={generarTotal}
							>
							<p className="flex gap-1 absolut justify-center">
								$
								<input
								className="w-28 text-center rounded"
								type="text"
								value={total}
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
									onChange={(e) => {
									handleFileChange(e);
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
									setIsCameraOpen(true)
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
						<Camera
						onCapture={handleCapture}
						onClose={() => setIsCameraOpen(false)}
						/>
					)}
				
					<div className="col-span-2 grid gap-2 grid-cols-2">
						<div className=" grid col-span-2">
							<label className=" p-1 font-bold">
							Nombre
							</label>
							<input 
							className="border p-2 rounded-lg"
							type="text"
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							placeholder="ejm: Proteina en polvo" />
						</div>
						<div className=" grid col-span-2 ">
							<label className=" p-1 font-bold">
							Marca
							</label>
							<input 
							className="border p-2 rounded-lg"
							type="text"
							value={marca}
							onChange={(e) => setMarca(e.target.value)}
							placeholder="ejm: DragonPharma" />
							
						</div>
						<div className=" grid ">
							<label className=" p-1 font-bold">
							Categoria
							</label>
							<input 
							className="border p-2 rounded-lg"
							type="text"
							value={categoria}
							onChange={(e) => setCategoria(e.target.value)}
							placeholder="ejm: Proteina" />
						</div>
						
						<div className=" grid ">
							<label className=" p-1 font-bold">
							Stock
							</label>
							<input 
							className="border p-2 rounded-lg"
							placeholder="ejm: 50"
							value={stock}
							onChange={(e) => setStock(e.target.value)}
							type="number" />
						</div>
						<div className="grid">
							<label className="p-1 font-bold">
								Precio
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
								<input
								className="border p-2 pl-8 rounded-lg w-full"
								value={precio}
								onChange={(e) => setPrecio(e.target.value)}
							
								type="number"
								min={0}
								step={0.01}
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
									value={descuento}
									onChange={(e) => setDescuento(e.target.value)}
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
								value={descripcion}
								onChange={(e) => setDescripcion(e.target.value)}
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