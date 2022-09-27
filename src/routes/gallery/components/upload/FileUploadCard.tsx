import { useRecoilValue } from "recoil";

import { galleryStore } from "../../stores";
import { handleFileInput } from "../../lib/gallery";
import FileUploadIcon from "../../../../components/icons/FileUploadIcon";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

const FileUploadCard = () => {
  const gallery = useRecoilValue(galleryStore);

  return (
    <div className="flex flex-wrap w-1/2 sm:w-1/4 lg:w-1/6">
      <label
        htmlFor="upload-file"
        className="group flex flex-col justify-center items-center w-full m-2 md:m-3 object-cover rounded-lg hover:border-primary overflow-hidden text-gray-500 dark:text-gray-400 hover:text-primary transition-colors ease-in bg-base-100 border-2 box-border border-gray-300 border-dashed cursor-pointer"
      >
        {gallery.loading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <FileUploadIcon />
              <p className="mb-2 text-sm">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs">SVG, PNG, JPG or GIF</p>
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
    </div>
  );
};

export default FileUploadCard;
