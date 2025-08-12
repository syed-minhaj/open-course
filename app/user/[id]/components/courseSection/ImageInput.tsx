import React, { useState,useEffect, ChangeEvent, DragEvent } from 'react';

interface ImageInputProps {
  onImageChange: (file: File | null) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  simple? : true ;
  clearImage? : number;
  defaultImage? : string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  onImageChange,
  maxSizeMB = 99,
  acceptedTypes = ['image/jpeg', 'image/png'],
  simple,
  clearImage,
  defaultImage,
}) => {

  const [preview, setPreview] = useState<string | null>();
  const [isDragging, setIsDragging] = useState(false);

  const fileInputId = `${Math.floor(Math.random() * 1000) + 1}flieInput`;
  
  useEffect(()=>{
    setPreview(null); 
  },[clearImage])

  useEffect(()=>{
    if(defaultImage){
      setPreview(defaultImage);
    }
  },[defaultImage])

  const validateFile = (file: File): boolean => {
    const isValidType = acceptedTypes.includes(file.type);
    const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
    return isValidType && isValidSize;
  };

  const handleImageChange = (file: File | null) => {
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleImageChange(file);
  };

  return (
    <div className={` mx-auto min-w-24 ${simple ? "max-h-full aspect-video h-auto w-24 " : 'w-full max-w-md  '}` }>
      {!preview ? (
        <div
          className={`relative border-2 border-dashed rounded-lg ${simple ? 'p-2' : 'p-8'} text-center cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50' :
               'border-gray-400 hover:border-gray-300  dark:border-gray-600 dark:hover:border-gray-500' }
            transition-colors duration-200`}
          onDragOver={handleDragOver} onDragLeave={handleDragLeave}
          onDrop={handleDrop} onClick={() => document.getElementById(fileInputId)?.click()}
        >
          <input type="file" id={fileInputId} className="hidden"
            accept={acceptedTypes.join(',')} onChange={handleFileSelect} />
          <div className="space-y-4">
            <div className="text-4xl text-gray-400 ">⇪</div>
            <div className={`text-lg font-medium text-gray-400 ${simple ? 'hidden' : ' '}`}>
              Drop your image here, or click to browse
            </div>
            <p className={`text-sm text-gray-500 ${simple ? 'hidden' : ' '} `}>
              Supports {acceptedTypes.map(type => type.split('/')[1]).join(', ')} files up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="relative group h-full w-full">
          <img src={preview} alt="Preview" className={`max-h-full ${simple ? 'h-16 w-24 ' : 'h-64 w-full '} object-cover rounded-lg`} />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100
              transition-opacity duration-200 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => {
              setPreview(null);
              if (document.getElementById(fileInputId)) {
                (document.getElementById(fileInputId) as HTMLInputElement).value = '';
              }
              onImageChange?.(null);
            }}
          >
            <p className="text-white font-medium">Click to remove</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInput;