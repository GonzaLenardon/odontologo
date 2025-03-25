import md5 from 'js-md5';

export const generateMd5Hash = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
        const fileContent = event.target.result;
        const hash = md5(fileContent);
        resolve(hash); 
        };

        reader.onerror = (error) => {
        reject(error); 
        };

        reader.readAsArrayBuffer(file); 
    });
};