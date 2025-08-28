const bytesToKB = bytes => bytes / 1024;
const bytesToMB = (bytes) => bytes / (1024 * 1024);
const bytesToGB = (bytes) => bytes / (1024 * 1024 * 1024);
  
export default function getByteSize(bytes) {
  if (bytes > 1024 * 1024 * 1024)  return bytesToGB(bytes).toFixed(2) + ' GB';
  if (bytes > 1024 * 1024) return bytesToMB(bytes).toFixed(2) + ' MB';
  if (bytes > 1024) return bytesToKB(bytes).toFixed(2) + ' KB';
  return bytes + ' Bytes';
}