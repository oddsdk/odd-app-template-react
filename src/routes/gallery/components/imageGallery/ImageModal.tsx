import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { galleryStore } from "../../stores";
import { deleteImageFromWNFS, type Image } from "../../lib/gallery";
import { ipfsGatewayUrl } from "../../../../lib/app-info";
import Download from '../../../../components/icons/Download'
import Trash from '../../../../components/icons/Trash'

type Props = {
  image: Image;
  isModalOpen: boolean;
  onClose: () => void;
};

const ImageModal = ({ image, isModalOpen, onClose }: Props) => {
  const gallery = useRecoilValue(galleryStore);
  const [selectedImage, setSelectedImage] = useState<Image | null>(image);
  const [openModal, setOpenModal] = useState<boolean>(isModalOpen);
  const [previousImage, setPreviousImage] = useState<Image | null>();
  const [nextImage, setNextImage] = useState<Image | null>();
  const [showPreviousArrow, setShowPreviousArrow] = useState<boolean>();
  const [showNextArrow, setShowNextArrow] = useState<boolean>();

  /**
   * Close the modal, clear the image state vars, set `isModalOpen` to false
   * and dispatch the close event to clear the image from the parent's state
   */
  const handleCloseModal: () => void = () => {
    setPreviousImage(null);
    setNextImage(null);
    setSelectedImage(null);
    setOpenModal(false);
    onClose();
  }

  /**
   * Delete an image from the user's WNFS
   */
  const handleDeleteImage: () => Promise<void> = async () => {
    if (selectedImage) {
      await deleteImageFromWNFS(selectedImage.name);
      handleCloseModal();
    }
  };

  /**
   * Set the previous and next images to be toggled to when the arrows are clicked
   */
  const setCarouselState = () => {
    const imageList = selectedImage?.private
      ? gallery.privateImages
      : gallery.publicImages;
    const currentIndex = imageList.findIndex(
      (val) => val.cid === selectedImage?.cid
    );
    const updatedPreviousImage =
      imageList[currentIndex - 1] ?? imageList[imageList.length - 1];
    setPreviousImage(updatedPreviousImage);
    const updatedNextImage = imageList[currentIndex + 1] ?? imageList[0];
    setNextImage(updatedNextImage);

    setShowPreviousArrow(imageList.length > 1 && !!updatedPreviousImage);
    setShowNextArrow(imageList.length > 1 && !!updatedNextImage);
  }

  /**
   * Load the correct image when a user clicks the Next or Previous arrows
   * @param direction
   */
  const handleNextOrPrevImage: (direction: "next" | "prev") => void = (direction) => {
    setSelectedImage(
      (direction === "prev" ? previousImage : nextImage) ?? null,
    );
  }
  useEffect(() => {
    setCarouselState();
  }, [selectedImage])

  /**
   * Detect `Escape` key presses to close the modal or `ArrowRight`/`ArrowLeft`
   * presses to navigate the carousel
   * @param event
   */
  const handleKeyDown: (event: KeyboardEvent) => void = (event) => {
    if (event.key === "Escape") handleCloseModal();

    if (showNextArrow && event.key === "ArrowRight")
      handleNextOrPrevImage("next");

    if (showPreviousArrow && event.key === "ArrowLeft")
      handleNextOrPrevImage("prev");
  }

  // Attach attach left/right/esc keys to modal actions
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const useMountEffect = () =>
    useEffect(() => {
      setCarouselState();
    }, []);

  useMountEffect();

  if (selectedImage) {
    return (
      <>
        <input
          type="checkbox"
          id={`image-modal-${selectedImage.cid}`}
          className="modal-toggle"
          checked={openModal}
          onChange={() => undefined}
        />
        <label
          htmlFor={`image-modal-${selectedImage.cid}`}
          className="modal cursor-pointer z-50"
          onClick={(event) => {
            if (event.currentTarget != event.target) {
              return;
            }

            handleCloseModal();
          }}
        >
          <div className="modal-box relative text-center text-base-content">
            <label
              htmlFor={`image-modal-${selectedImage.cid}`}
              className="btn btn-xs btn-circle absolute right-2 top-2"
              onClick={handleCloseModal}
            >
              ✕
            </label>
            <div>
              <h3 className="mb-7 text-lg break-all">{selectedImage.name}</h3>

              <div className="relative">
                {showPreviousArrow && (
                  <button
                    className="absolute top-1/2 -left-[25px] -translate-y-1/2 inline-block text-center text-[40px]"
                    onClick={() => handleNextOrPrevImage("prev")}
                  >
                    &#8249;
                  </button>
                )}
                <img
                  className="block object-cover object-center border-2 border-base-content w-full h-full mb-4 rounded-[1rem]"
                  alt={selectedImage.name}
                  src={selectedImage.src}
                />
                {showNextArrow && (
                  <button
                    className="absolute top-1/2 -right-[25px] -translate-y-1/2 inline-block text-center text-[40px]"
                    onClick={() => handleNextOrPrevImage("next")}
                  >
                    &#8250;
                  </button>
                )}
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 text-neutral-500">
                  Created {new Date(selectedImage.ctime).toDateString()}
                </p>

                <a
                  href={`https://ipfs.${ipfsGatewayUrl}/ipfs/${selectedImage.cid}/userland`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline mb-2 hover:text-neutral-500"
                >
                  View on IPFS{selectedImage.private && `*`}
                </a>

                {selectedImage.private && (
                  <>
                    <p className="mb-2 text-neutral-700 dark:text-neutral-500">
                      * Your private files can only be viewed on devices that
                      have permission. When viewed directly on IPFS, you will
                      see the encrypted state of this file. This is because the
                      raw IPFS gateway view does not have permission to decrypt
                      this file.
                    </p>
                    <p className="mb-2 text-neutral-700 dark:text-neutral-500">
                      Interested in private file sharing as a feature? Follow
                      the{" "}
                      <a
                        className="underline"
                        href="https://github.com/webnative-examples/webnative-app-template/issues/4"
                        target="_blank"
                        rel="noreferrer"
                      >
                        github issue.
                      </a>
                    </p>
                  </>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                  <a
                    href={selectedImage.src}
                    download={selectedImage.name}
                    className="btn btn-primary gap-2"
                  >
                    <Download />
                    Download Image
                  </a>
                  <button
                    className="btn btn-outline gap-2"
                    onClick={handleDeleteImage}
                  >
                    <Trash />
                    Delete Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </label>
      </>
    );
  }

  return null;
};

export default ImageModal;
