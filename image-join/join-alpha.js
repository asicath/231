const sharp = require('sharp');

async function testAlpha() {
    let folder = process.argv[2];

    //Z:\git\Tiles\Tiles\Assets\Textures\diamonds
    const filename = `Z:\\git\\Tiles\\Tiles\\Assets\\Textures\\${folder}\\spec.png`;
    const data = sharp(filename).extractChannel('red').toBuffer().then(data => {
        sharp(filename)
            .joinChannel(data)
            .tiff({
                compression: 'lzw',
                bitdepth: 1
            })
            .toFile(filename.replace('.png', '-a.tif'));
    })

}

testAlpha();
