class BeansFileSystem {
    constructor() {
      this.root = {
        type: 'directory',
        content: {}
      };
    }
  
    createFile(path, content) {
      const segments = this.getPathSegments(path);
      const fileName = segments.pop();
      const directory = this.traverse(segments);
  
      if (!directory || directory.content[fileName]) {
        console.error('File already exists or invalid path.');
        return;
      }
  
      directory.content[fileName] = {
        type: 'file',
        content: content
      };
    }
  
    createDirectory(path) {
      const segments = this.getPathSegments(path);
      const directoryName = segments.pop();
      const directory = this.traverse(segments);
  
      if (!directory || directory.content[directoryName]) {
        console.error('Directory already exists or invalid path.');
        return;
      }
  
      directory.content[directoryName] = {
        type: 'directory',
        content: {}
      };
    }
  
    readFile(path) {
      const segments = this.getPathSegments(path);
      const fileName = segments.pop();
      const directory = this.traverse(segments);
  
      if (!directory || !directory.content[fileName] || directory.content[fileName].type !== 'file') {
        console.error('File not found or invalid path.');
        return null;
      }
  
      return directory.content[fileName].content;
    }
  
    readDirectory(path) {
      const segments = this.getPathSegments(path);
      const directory = this.traverse(segments);
  
      if (!directory || directory.type !== 'directory') {
        console.error('Directory not found or invalid path.');
        return null;
      }
  
      return Object.keys(directory.content);
    }
    isFile(path) {
      const segments = this.getPathSegments(path);
      const fileName = segments.pop();
      const directory = this.traverse(segments);
  
      return directory && directory.content[fileName] && directory.content[fileName].type === 'file';
    }
    getParentDirectory(path) {
      const segments = this.getPathSegments(path);
  
      if (segments.length === 0 || (segments.length === 1 && segments[0] === '')) {
        return path;
      }
  
      segments.pop();
      var newPath = "/" + segments.join('/') + "/";
      if (newPath == "//"){
        newPath = "/";
      }
      return newPath
    }
    rename(oldPath, newName) {
      const segments = this.getPathSegments(oldPath);
      const oldName = segments.pop();
      const directory = this.traverse(segments);
  
      if (!directory || !directory.content[oldName]) {
        console.error('File or directory not found or invalid path.');
        return;
      }
  
      const isDirectory = directory.content[oldName].type === 'directory';
  
      if (directory.content[newName]) {
        console.error('A file or directory with the new name already exists.');
        return;
      }
  
      directory.content[newName] = directory.content[oldName];
      delete directory.content[oldName];
  
      // If it was a directory, update the content of the parent directory
      if (isDirectory) {
        const parentPath = this.getParentDirectory(oldPath);
        const parentSegments = this.getPathSegments(parentPath);
        const parentDirectory = this.traverse(parentSegments);
  
        if (parentDirectory) {
          parentDirectory.content[newName] = directory.content[newName];
          delete parentDirectory.content[oldName];
        }
      }
    }
  
    traverse(segments) {
      let current = this.root;
  
      for (const segment of segments) {
        if (current.type !== 'directory' || !current.content[segment]) {
          return null;
        }
  
        current = current.content[segment];
      }
  
      return current;
    }
  
    getPathSegments(path) {
      return path.split('/').filter(segment => segment !== '');
    }
}