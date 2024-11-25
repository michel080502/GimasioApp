import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const Camera = ({ onCapture, onClose }) => {
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		// Inicia la cámara automáticamente al montar el componente
		openCamera();
		return () => closeCamera(); // Detiene la cámara al desmontar
	}, []);

	const openCamera = async () => {
		try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
		if (videoRef.current) {
			videoRef.current.srcObject = stream;
			videoRef.current.play();
		}
		} catch (error) {
		console.error("Error al acceder a la cámara:", error);
		alert("No se puede acceder a la cámara");
		}
	};

	const closeCamera = () => {
		if (videoRef.current && videoRef.current.srcObject) {
		const stream = videoRef.current.srcObject;
		const tracks = stream?.getTracks();
		if (tracks) {
			tracks.forEach((track) => track.stop());
		}
		}
	};

	const capturePhoto = () => {
		if (canvasRef.current && videoRef.current) {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		const context = canvas.getContext("2d");

		// Dimensiones originales del video
		const videoWidth = video.videoWidth;
		const videoHeight = video.videoHeight;

		// Determinar el tamaño del cuadrado
		const size = Math.min(videoWidth, videoHeight);

		// Calcular el recorte centrado
		const offsetX = (videoWidth - size) / 2;
		const offsetY = (videoHeight - size) / 2;

		// Configurar el lienzo para un tamaño cuadrado
		canvas.width = size;
		canvas.height = size;

		// Dibujar el video recortado y centrado
		context.drawImage(
			video,
			offsetX, // Recorte desde la izquierda
			offsetY, // Recorte desde arriba
			size, // Ancho del recorte
			size, // Alto del recorte
			0, // Posición X en el lienzo
			0, // Posición Y en el lienzo
			size, // Ancho en el lienzo
			size // Alto en el lienzo
		);

		// Obtener la imagen del lienzo en formato Base64
		const imageData = canvas.toDataURL("image/jpeg");
		onCapture(imageData);
		closeCamera();
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-20">
		<video ref={videoRef} className="w-full max-w-md h-auto bg-black" />
		<div className="flex gap-4 mt-4">
			<button
			type="button"
			className="px-4 py-2 bg-red-500 text-white rounded"
			onClick={() => {
				closeCamera();
				onClose();
			}}
			>
			Cerrar Cámara
			</button>
			<button
			type="button"
			className="px-4 py-2 bg-green-500 text-white rounded"
			onClick={capturePhoto}
			>
			Capturar Foto
			</button>
		</div>
		<canvas ref={canvasRef} className="hidden"></canvas>
		</div>
	);
};

Camera.propTypes = {
	onCapture: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default Camera;
