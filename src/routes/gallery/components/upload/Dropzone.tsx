import { DragEvent, ReactNode, useState } from "react";

import { addNotification } from "../../../../lib/notifications";
import { getImagesFromWNFS, uploadImageToWNFS } from "../../lib/gallery";

/**
 * This is needed to prevent the default behaviour of the file opening in browser
 * when it is dropped
 * @param event
 */
const handleDragOver: (event: DragEvent<HTMLLabelElement>) => void = (event) =>
  event.preventDefault();

type Props = {
  children: ReactNode;
};

const Dropzone = ({ children }: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Detect when a user drags a file in or out of the dropzone to change the styles
   */
  const handleDragEnter: () => void = () => setIsDragging(true);
  const handleDragLeave: () => void = () => setIsDragging(false);

  /**
   * Process files being dropped in the drop zone and ensure they are images
   * @param event
   */
  const handleDrop: (
    event: DragEvent<HTMLLabelElement>
  ) => Promise<void> = async (event) => {
    // Prevent default behavior (Prevent file from being opened)
    (event as any).preventDefault();

    const files = Array.from((event as any).dataTransfer.items);

    // Iterate over the dropped files and upload them to WNFS
    await Promise.all(
      files.map(async (item: any) => {
        if (item.kind === "file") {
          const file: File = item.getAsFile();

          // If the dropped files aren't images, we don't want them!
          if (!file.type.match("image/*")) {
            addNotification({
              msg: "Please upload images only",
              type: "error",
            });
          } else {
            await uploadImageToWNFS(file);
          }
        }
      })
    );

    // Refetch images and update galleryStore
    await getImagesFromWNFS();

    // Disable isDragging state
    setIsDragging(false);
  };

  return (
    <label
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      htmlFor="dropzone-file"
      className={`block w-full min-h-[calc(100vh-190px)] rounded-lg border-2 border-solid border-base-content transition ease-in cursor-pointer ${
        isDragging ? "border-dashed !border-orange-700 bg-orange-50" : ""
      }`}
    >
      {children}
    </label>
  );
};

export default Dropzone;
