import { useRecoilValue } from "recoil";

import { galleryStore } from "../../stores";
import { handleFileInput } from "../../lib/gallery";
import FileUploadIcon from "../icons/FileUploadIcon";

const FileUploadCard = () => {
  const gallery = useRecoilValue(galleryStore);

  return (
    <label
      htmlFor="upload-file"
      className="group btn flex flex-col justify-center items-center !p-0 !h-auto aspect-[22/23] object-cover rounded-lg shadow-orange hover:border-neutral-500 overflow-hidden transition-colors ease-in bg-base-100 border-2 box-content border-neutral-900 cursor-pointer text-neutral-900 bg-gradient-to-r from-orange-300 to-orange-600"
    >
      {gallery.loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-t-orange-300 border-neutral-900 h-16 w-16 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center pt-5 pb-6">
            <FileUploadIcon />
            <p className="mt-4 mb-2 text-sm">
              <span className="font-bold text-sm">Click to upload</span>
            </p>
            <p className="text-xxs">SVG, PNG, JPG or GIF</p>
          </div>
          <input
            onChange={(e) => handleFileInput(e.target.files)}
            id="upload-file"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
          />
        </>
      )}
    </label>
  );
};

export default FileUploadCard;
