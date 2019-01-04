const { readFile, writeFile } = require('fs');
const path = require('path');

// Using console.log
// readFile(path.resolve('manifest.json'), (err, manifestData) => {
//   const manifest = JSON.parse(manifestData.toString());

//   if (!err) {
//     let copyed = 0;
//     manifest.forEach(entry => {
//       readFile(path.resolve(entry.metadata), (err, meta) => {
//         const metadata = JSON.parse(meta.toString());
        
//         if (!err) {
//           readFile(path.resolve(entry.file), (err, file) => {
//             if (!err) {
//               writeFile(path.resolve('output.callback', `${metadata.name}.${metadata.extension}`), file, err => {
//                 if (!err) {
//                   copyed += 1;
//                   console.log(`File ${metadata.name}.${metadata.extension} writed!`);
                  
//                   if (copyed === manifest.length) {
//                     console.log(`\nDone copying ${copyed} files`);
//                   }
//                 } else {
//                   console.log('Error at writing file');
//                 }
//               });
//             } else {
//               console.log('Error at reading file');
//             }
//           });
//         } else {
//           console.log('Error at metadata file');
//         }
//       });
//     });
//   } else {
//     console.log('Errot at manifest.json');
//   }
// });

// Using throw error
readFile(path.resolve('manifest.json'), (err, manifestData) => {
  const manifest = JSON.parse(manifestData.toString());

  if (err) {
    throw err;
  }

  let copyed = 0;
  manifest.forEach(entry => {
    readFile(path.resolve(entry.metadata), (err, meta) => {
      const metadata = JSON.parse(meta.toString());
      
      if (err) {
        throw err;
      }
      readFile(path.resolve(entry.file), (err, file) => {
        if (err) {
          throw err;
        }
        writeFile(path.resolve('output.callback', `${metadata.name}.${metadata.extension}`), file, err => {
          if (err) {
            throw err;
          }
          copyed += 1;
          console.log(`File ${metadata.name}.${metadata.extension} writed!`);

          if (copyed === manifest.length) {
            console.log(`\nDone copying ${copyed} files`);
          }
        });
      });
    });
  });
});
