const openCamera = async (videoRef, setIsCameraOpen) =>{
	try {
		setIsCameraOpen(true);
		const stream = await navigator.mediaDevices.getUserMedia({ video: true});
		if(videoRef.current){
			videoRef.current.srcObject = stream;
			videoRef.current.play();
		}
	} catch(error){
		console.log('Error al encender camara', error);
		alert('No se puede acceder a la camara');
	}
}

const capturePhoto = (videoRef, canvasRef, setImagePreview,  setIsCameraOpen) => {
	if(canvasRef.current && videoRef.current){
		const canvas = canvasRef.current;
		const video = videoRef.current;
		const context = canvas.getContext("2d");

		// Dimensiones del video
		const videoWidth = video.videoWidth;
		const videoHeight = video.videoHeight;

		// Determinar tamaño cuadrado
		const size = Math.min(videoWidth, videoHeight);

		// Centrar
		const offsetX = (videoWidth - size) / 2;
		const offsetY = (videoHeight - size) / 2;

		// Lienzo en cuadrado
		canvas.width = size;
		canvas.height = size;

		// Dibujar la foto
		context.drawImage(
			video,
			offsetX,
			offsetY,
			size,
			size,
			0,
			0,
			size,
			size
		)

		// Obtenemos la imagen en formato BASE64
		const imageData = canvas.toDataURL("image/jpeg");
		setImagePreview(imageData);

		// Convertimos a BLOB
		const byteString = atob(imageData.split(",")[1]);
		const mimeString = imageData.split(",")[0].split(":")[1].split(";")[0];

		const buffer = new Uint16Array(byteString.length);

		for(let i = 0; i < byteString.length; i++){
			buffer[i] = byteString.charCodeAt(i);
		}

		const blob = new Blob([buffer] , { type: mimeString});
		const file = new File([blob], "captured-photo.jpg", { type: mimeString });

		console.log(file);

		const stream = video.srcObject;
		const tracks = stream.getTracks();

		tracks.forEach((track) => track.stop());
		setIsCameraOpen(false);
	}
}


export {
	openCamera,
	capturePhoto
}