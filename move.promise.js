const fs = require('fs');
const path = require('path');

const readFile = path =>
  new Promise((resolve, reject) =>
    fs.readFile(path, (err, data) => err ? reject(err) : resolve(data))
  );

const writeFile = (path, data) =>
  new Promise((resolve, reject) =>
    fs.writeFile(path, data, (err, data) => err ? reject(err) : resolve(data))
  );

// Using throw error
// readFile(path.resolve('manifest.json')).then(manifestData => {
//   const manifest = JSON.parse(manifestData.toString());

//   let copyed = 0;
//   manifest.forEach(entry => {
//     readFile(path.resolve(entry.metadata)).then(meta => {
//       const metadata = JSON.parse(meta.toString());

//       readFile(path.resolve(entry.file)).then(file => {
//         writeFile(path.resolve('output.promise', `${metadata.name}.${metadata.extension}`), file).then(() => {
//           copyed += 1;
//           console.log(`File ${metadata.name}.${metadata.extension} writed!`);

//           if (copyed === manifest.length) {
//             console.log(`\nDone copying ${copyed} files`);
//           }
//         }).catch(err => { throw err });
//       }).catch(err => { throw err });
//     }).catch(err => { throw err });
//   });
// }).catch(err => { throw err });



const readJSON = path =>
  readFile(path)
    .then(file => JSON.parse(file.toString()));

const copyFile = (source, destination) =>
  readFile(source).then(file =>
    writeFile(destination, file)
  );

readJSON(path.resolve('manifest.json'))
  .then(manifest => Promise.all(manifest.map(({ file, metadata }) => 
    readJSON(metadata)
      .then(({ name, extension }) => ({ file, name, extension })))))
  .then(filesData => Promise.all(filesData.map(({ file, name, extension }) => 
    copyFile(file, path.resolve('output.promise', `${name}.${extension}`)))))
  .then(({ length }) => console.log(`Done copying ${length} file${length > 1 ? 's' : ''}.`))
  .catch(err => console.error(`Error: ${err}`));


