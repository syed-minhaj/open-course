"use client";


export async function resizeFile  (file: File, targetSize: number, sizeUnit: "KB" | "MB") {
    

    const targetSizeInBytes = targetSize * (sizeUnit === "MB" ? 1024 * 1024 : 1024);

    try {
      const image = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return {"file":null ,"error":"Unable to create canvas context"};
      }

      let quality = 0.9;
      let resizedBlob: Blob;

      do {
        const scale = Math.sqrt(targetSizeInBytes / file.size);
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        resizedBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), file.type, quality);
        });

        quality -= 0.1;
      } while (resizedBlob.size > targetSizeInBytes && quality > 0.1);

      const resizedFile = new File([resizedBlob], file.name, {
        type: file.type,
      });

      const returnFile = {
        blob: resizedBlob,
        url: URL.createObjectURL(resizedBlob),
        filename: `resized_${file.name}`,
        size: resizedFile.size,
      };

      return {"file":returnFile ,"error":null};
    } catch (err) {
      throw err;
    }
};

