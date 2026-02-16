const fetch = require('node-fetch');
const FormData = require('form-data');
const FileType = require('file-type');

/**
 * Upload buffer to VyDrive
 * @param {Buffer} buffer 
 * @returns {Promise<string>} URL of the uploaded file
 */
const catbox = async (buffer) => {
    const fileType = await FileType.fromBuffer(buffer);
    if (!fileType) throw new Error('File type tidak dikenali');
    const ext = fileType.ext;
    
    const bodyForm = new FormData();
    bodyForm.append("file", buffer, { 
        filename: `file.${ext}`,
        contentType: fileType.mime
    });

    const res = await fetch("https://vydrive.zone.id/upload", {
        method: "POST",
        body: bodyForm,
        headers: {
            ...bodyForm.getHeaders(),
            // Adding User-Agent and Accept headers as some APIs require them
            'User-Agent': 'Mozilla/5.0 (Node.js)',
            'Accept': 'application/json'
        }
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('VyDrive API Error:', res.status, errText);
        throw new Error(`Upload gagal: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.url) {
        console.error('VyDrive Unexpected Response:', data);
        throw new Error('Respon API tidak mengandung URL');
    }
    return data.url;
};

module.exports = { catbox };