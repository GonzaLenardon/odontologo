import { cleanFileName } from '../../utils/cleanFileName';
import { axiosPost } from '../axiosPost';

const CHUNK_SIZE = 128000; // 2MB por chunk

export async function videoUpload(logout, video) {
  //cambiar espacios por guion bajo
  const file = video;
  const updatedFileName = cleanFileName(file.name);
  const updatedFile = new File([file], updatedFileName, { type: file.type });

  //se calcula total de chunks
  const totalChunks = Math.ceil(updatedFile.size / CHUNK_SIZE);
  console.log('totalchunks', totalChunks);
  console.log(`File size: ${updatedFile.size} bytes`);
  console.log(`Chunk size: ${CHUNK_SIZE} bytes`);

  //se sube cada chunk
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(updatedFile.size, start + CHUNK_SIZE);
    const chunk = updatedFile.slice(start, end);

    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunkIndex', i);
    formData.append('totalChunks', totalChunks);
    formData.append('fileName', updatedFileName);
    console.log(`Chunk number: ${i}`);
    console.log(`formData: ${formData.get('fileName')}`);

    try {
      await axiosPost(logout, formData, '/files/upload-chunk-ats', false);
    } catch (error) {
      console.error('Error al subir el chunk: ', i, ' error: ', error);
      break; // Salir del bucle si hay un error en un chunk
    }
  }

  console.log('Todos los chunks han sido subidos.');
}

export default videoUpload;
