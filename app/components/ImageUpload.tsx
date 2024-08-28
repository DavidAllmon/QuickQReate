import React, { useCallback, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onImageUpload(null);
  }, [onImageUpload]);

  return (
    <div className="mb-8">
      <label htmlFor="logo-upload" className="block text-lg font-medium mb-2 text-purple-300">
        Upload Logo (optional)
      </label>
      <div className="flex items-center space-x-4">
        <label
          htmlFor="logo-upload"
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
        >
          Choose Image
          <input
            type="file"
            id="logo-upload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {preview && (
          <div className="relative">
            <Image
              src={preview}
              alt="Logo preview"
              width={50}
              height={50}
              className="rounded-md"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-300"
            >
              ×
            </button>
          </div>
        )}
      </div>
      {!preview && (
        <p className="text-sm text-gray-400 mt-2">No image selected</p>
      )}
    </div>
  );
};

export default ImageUpload;