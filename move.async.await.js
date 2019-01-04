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

async function move() {
  try {
    const manifest = await readFile(path.resolve('manifest.json'))
    const manifestParsed = JSON.parse(manifest.toString());

    let copyed = 0;
    manifestParsed.forEach(async entry => {
      try {
        const metadata = await readFile(path.resolve(entry.metadata));
        const metadataParsed = JSON.parse(metadata.toString());

        const file = await readFile(path.resolve(entry.file));
        await writeFile(path.resolve('output.async.await', `${metadataParsed.name}.${metadataParsed.extension}`), file)
        
        copyed += 1;
        console.log(`File ${metadataParsed.name}.${metadataParsed.extension} writed!`);

        if (copyed === manifestParsed.length) {
          console.log(`\nDone copying ${copyed} files`);
        }
      } catch (err) {
        throw err;
      }
    });
  } catch (err) {
    throw err;
  }
}

move();
