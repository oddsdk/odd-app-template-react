import { useCallback, useContext, useEffect, useState } from 'react';

import { deleteImageFromWNFS } from '../../../lib/gallery';
import FilesystemContext from '../../../contexts/FilesystemContext';
import NotificationsContext from '../../../contexts/NotificationsContext';
import GalleryContext, { type Image } from "../../../contexts/GalleryContext";
import { fissionServerUrl } from '../../../lib/app-info';

let previousImage: Image | null
let nextImage: Image | null
let showPreviousArrow: boolean
let showNextArrow: boolean

type Props = {
  image: Image;
  isModalOpen: boolean;
  onClose: () => void;
};

const ImageModal = ({ image, isModalOpen, onClose }: Props) => {
  const { fs } = useContext(FilesystemContext);
  const { gallery, updateGallery } = useContext(GalleryContext);
  const notificationsContext = useContext(NotificationsContext);
  const [selectedImage, setSelectedImage] = useState<Image | null>(image)
  const [openModal, setOpenModal] = useState(isModalOpen);

  /**
   * Close the modal, clear the image state vars, set `isModalOpen` to false
   * and dispatch the close event to clear the image from the parent's state
   */
  const handleCloseModal: () => void = useCallback(() => {
    setSelectedImage(null);
    previousImage = null;
    nextImage = null;
    setOpenModal(false);
    onClose();
  }, [onClose]);

  /**
   * Delete an image from the user's WNFS
   */
  const handleDeleteImage: () => Promise<void> = async () => {
    if (selectedImage) {
      await deleteImageFromWNFS({
        name: selectedImage.name,
        gallery,
        updateGallery,
        fs,
        ...notificationsContext,
      });
      handleCloseModal();
    }
  };

  /**
   * Set the previous and next images to be toggled to when the arrows are clicked
   */
  const setCarouselState = useCallback(() => {
    const imageList = selectedImage?.private
      ? gallery.privateImages
      : gallery.publicImages;
    const currentIndex = imageList.findIndex(
      (val) => val.cid === selectedImage?.cid
    );
    previousImage =
      imageList[currentIndex - 1] ?? imageList[imageList.length - 1];
    nextImage = imageList[currentIndex + 1] ?? imageList[0];

    showPreviousArrow = imageList.length > 1 && !!previousImage;
    showNextArrow = imageList.length > 1 && !!nextImage;
  }, [
    gallery.privateImages,
    gallery.publicImages,
    selectedImage?.cid,
    selectedImage?.private,
  ]);

  /**
   * Load the correct image when a user clicks the Next or Previous arrows
   * @param direction
   */
  const handleNextOrPrevImage: (direction: 'next' | 'prev') => void =
    useCallback(
      (direction) => {
        setSelectedImage(direction === 'prev' ? previousImage : nextImage);
        setCarouselState();
      },
      [setCarouselState]
    );

  /**
   * Detect `Escape` key presses to close the modal or `ArrowRight`/`ArrowLeft`
   * presses to navigate the carousel
   * @param event
   */
  const handleKeyDown: (event: KeyboardEvent) => void = useCallback(event => {
    if (event.key === 'Escape') handleCloseModal();

    if (showNextArrow && event.key === 'ArrowRight')
      handleNextOrPrevImage('next');

    if (showPreviousArrow && event.key === 'ArrowLeft')
      handleNextOrPrevImage('prev');
  }, [handleNextOrPrevImage, handleCloseModal]);

  // Attach attach left/right/esc keys to modal actions
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const useMountEffect = () =>
    useEffect(() => {
      setCarouselState();
    }, []);

  useMountEffect();

  if (!!selectedImage) {
    return (
      <>
        <input
          type="checkbox"
          id={`image-modal-${selectedImage.cid}`}
          className="modal-toggle"
          checked={openModal}
        />
        <label
          htmlFor={`image-modal-${selectedImage.cid}`}
          className="modal cursor-pointer z-50"
          onClick={handleCloseModal}
        >
          <div className="modal-box relative text-center text-base-content border dark:border-slate-600">
            <label
              htmlFor={`image-modal-${selectedImage.cid}`}
              className="btn btn-xs btn-circle absolute right-2 top-2 dark:bg-slate-600"
              onClick={handleCloseModal}
            >
              ✕
            </label>
            <div>
              <h3 className="mb-7 text-xl font-serif">{selectedImage.name}</h3>

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
                  className="block object-cover object-center w-full h-full mb-4 rounded-[1rem]"
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
                <a
                  href={`https://ipfs.${fissionServerUrl}/ipfs/${selectedImage.cid}/userland`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline mb-4 hover:text-slate-500"
                >
                  View on IPFS
                </a>
                <p className="mb-4">
                  Created at {new Date(selectedImage.ctime).toDateString()}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <a
                    href={selectedImage.src}
                    download={selectedImage.name}
                    className="btn btn-primary"
                  >
                    Download Image
                  </a>
                  <button
                    className="btn bg-error text-white"
                    onClick={handleDeleteImage}
                  >
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

