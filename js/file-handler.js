window.FileHandler = {
  maxBytes: 2 * 1024 * 1024,
  validate(file){
    if(!file) throw new Error('Please select a log file first.');
    if(!/\.(log|txt)$/i.test(file.name || '')) throw new Error('Please choose a .log or .txt file.');
    if(!Number.isFinite(file.size) || file.size < 0) throw new Error('Unable to read the file size.');
    if(file.size > this.maxBytes) throw new Error('File is larger than 2 MB. Choose a smaller log.');
    if(file.size === 0) throw new Error('The selected file is empty.');
  },
  async read(file){
    this.validate(file);
    const text = await file.text();
    if(!text.trim()) throw new Error('The selected file contains no log entries.');
    if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)){
      throw new Error('This file appears to be binary or uses an unsupported encoding. Export a UTF-8 text log.');
    }
    return text;
  },
  size(bytes){
    if(bytes < 1024) return bytes + ' B';
    if(bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1048576).toFixed(1) + ' MB';
  }
};
