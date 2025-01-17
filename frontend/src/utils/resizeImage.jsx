

export const resizeImage = (file, size = 300) => {
    return new Promise((resolve, reject) => {
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
      });
}

