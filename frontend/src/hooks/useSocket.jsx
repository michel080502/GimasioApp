import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const useSocket = (eventsHandlers) => {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Guardamos los manejadores de eventos en un ref para evitar cambios constantes
  const eventHandlersRef = useRef(eventsHandlers);

  // Actualizamos el ref solo cuando los eventos cambian
  useEffect(() => {
    eventHandlersRef.current = eventsHandlers;
  }, [eventsHandlers]);

  useEffect(() => {
    // Solo inicializa el socket si no está ya conectado
    if (!socketRef.current) {
      const socket = io(`ws:${import.meta.env.VITE_BACKEND_URL}`);
      socketRef.current = socket;
      setSocket(socket);

      // Configura los manejadores de eventos
      Object.keys(eventHandlersRef.current).forEach((event) => {
        socket.on(event, eventHandlersRef.current[event]);
      });
    }

    // Limpia la conexión solo cuando el componente se desmonte
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Este efecto ahora solo se ejecuta una vez

  return socket;
};

export default useSocket;
