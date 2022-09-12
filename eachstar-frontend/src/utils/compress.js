export default function compress(file, val, type) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                const canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d');
                let width = image.width,
                    height = image.height;
                switch (type) {
                    case 'w':
                        width = width > val ? val : width;
                        height = (width * image.height) / image.width;
                        break;
                    case 'h':
                        height = height > val ? val : height;
                        width = (height * image.width) / image.height;
                        break;
                    case 's':
                        if (width > height) {
                            height = height > val ? val : height;
                            width = (height * image.width) / image.height;
                        } else {
                            width = width > val ? val : width;
                            height = (width * image.height) / image.width;
                        }
                        break;
                    case 'l':
                    default:
                        if (width > height) {
                            width = width > val ? val : width;
                            height = (width * image.height) / image.width;
                        } else {
                            height = height > val ? val : height;
                            width = (height * image.width) / image.height;
                        }
                        break;
                }
                canvas.width = width;
                canvas.height = height;

                context.drawImage(image, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg'));
            };
        };
    });
}
