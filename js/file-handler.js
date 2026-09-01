window.FileHandler = {
  async read(file){
    if(!file) throw new Error('No file selected.');
    const allowed = ['text/plain','application/octet-stream',''];
    const ext = file.name.split('.').pop().toLowerCase();
    if(!['log','txt'].includes(ext) && !allowed.includes(file.type)) throw new Error('Please choose a .log or .txt file.');
    if(file.size > 2 * 1024 * 1024) throw new Error('File is larger than 2 MB. Use a smaller demo log.');
    return await file.text();
  },
  size(bytes){
    if(bytes < 1024) return bytes + ' B';
    if(bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1048576).toFixed(1) + ' MB';
  }
};
