const fs = require('fs/promises');

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.log(error);
  }
}

module.exports = deleteFile;