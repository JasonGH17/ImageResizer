const sharp = require("sharp");
const fs = require('fs');
const path = require('path');
const sOf = require("image-size");

const imgFolder = path.join(__dirname, "./images");
const outFolder = path.join(__dirname, "./out");
if (!fs.existsSync(outFolder)) fs.mkdirSync(outFolder);

fs.readdir(imgFolder, (err, images) => {
    if (err) return console.error(err.message);

    const imgRegex = new RegExp("[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$");

    for (let image of images) {
        if (image.match(imgRegex)) {

            const imgPath = path.join(imgFolder, image);
            const imgOutPath = path.join(outFolder, image);
            const sOrigin = sOf(imgPath);
            const oOrigin = sOrigin.orientation || 1; // 1 is landscape, 6 is portrait


            sharp(imgPath).resize(1920, 1080, { fit: "inside" }).withMetadata().toFile(imgOutPath)
                .then(() => {
                    if (process.argv.length === 3 && process.argv[2] === "-d")
                        console.log(`Image: ${image}\n\tOld Dimensions: ${oOrigin === 1 ? `${sOrigin.width}x${sOrigin.height}` : `${sOrigin.height}x${sOrigin.width}`}\n\tNew Dimensions: ${sOf(imgOutPath).width}x${sOf(imgOutPath).height}\n`);
                });
        }
    }
});