function convertToImage() {
    var hexData = document.getElementById("hexData").value.trim();
    var errorMessage = document.getElementById("error-message");

    errorMessage.style.display = "none";
    document.getElementById("hexData").classList.remove("textarea-error");

    if (!hexData) {
        errorMessage.textContent = "Field 'Hex' cannot be empty.";
        errorMessage.style.display = "inline";
        document.getElementById("hexData").classList.add("textarea-error");
        return;
    }

    try {
        hexData = hexData.replace(/^0x/, '');
        var binaryData = new Uint8Array(hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        var blob = new Blob([binaryData]);
        var format = detectImageFormat(hexData);
        var img = new Image();
        img.src = URL.createObjectURL(blob);
        
        img.onload = function() {
            var canvas = document.getElementById("imageCanvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            document.querySelector('.image-output').style.display = 'flex';

            createDownloadLink(canvas, format);
            document.getElementById("imageResolution").textContent = `Resolution: ${img.width} x ${img.height}`;
            var imageSize = (blob.size / 1024).toFixed(2); 
            document.getElementById("imageSize").textContent = `Size: ${imageSize} KB`;
            document.getElementById("mimeType").textContent = `MIME Type: image/${format}`;
        };

        img.onerror = function() {
            errorMessage.textContent = "Conversion Failed, Please check your hex data.";
            errorMessage.style.display = "inline";
        };
    } catch (error) {
        errorMessage.textContent = "Conversion Failed, Please check your hex data.";
        errorMessage.style.display = "inline";
    }
}

function detectImageFormat(hexData) {
    hexData = hexData.toLowerCase();
    const jpegHeader = 'ffd8ff';
    const pngHeader = '89504e47';
    const gifHeader = '47494638';
    const bmpHeader = '424d';

    if (hexData.startsWith(jpegHeader)) {
        return 'jpeg';
    } else if (hexData.startsWith(pngHeader)) {
        return 'png';
    } else if (hexData.startsWith(gifHeader)) {
        return 'gif';
    } else if (hexData.startsWith(bmpHeader)) {
        return 'bmp';
    } else {
        return 'png';
    }
}

function createDownloadLink(canvas, format) {
    var downloadLink = document.getElementById("downloadLink");
    var dataURL = canvas.toDataURL(`image/${format}`);
    downloadLink.href = dataURL;
    downloadLink.download = `image.${format}`;
    downloadLink.style.display = 'block';
}
