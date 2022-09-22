import { useContext, useEffect, useState } from "react";

import FilesystemContext from '../../../contexts/FilesystemContext';
import GalleryContext, { AREAS, type Image} from "../../../contexts/GalleryContext";
import { getImagesFromWNFS } from '../../../lib/gallery';
import FileUploadCard from '../upload/FileUploadCard';
import ImageCard from './ImageCard';
import ImageModal from './ImageModal';

const ImageGallery = () => {
  const { fs } = useContext(FilesystemContext);
  const { gallery, updateGallery } = useContext(GalleryContext);

  const [selectedArea, setSelectedArea] = useState<string | null>(
    gallery.selectedArea
  );
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const selectedGallery =
    gallery.selectedArea === AREAS.PRIVATE
      ? gallery.privateImages
      : gallery.publicImages;

  /**
   * Open the ImageModal and pass it the selected `image` from the gallery
   * @param image
   */
  const handleOpenModal: (image: Image) => void = (image) =>
    setSelectedImage(image);

  const clearSelectedImage = () => setSelectedImage(null);

  useEffect(() => {
    // If galleryStore.selectedArea changes from private to public, re-run getImagesFromWNFS
    if (selectedArea !== gallery.selectedArea) {
      const refetchImages = async () => {
        setSelectedArea(gallery.selectedArea);
        await getImagesFromWNFS({ gallery, updateGallery, fs });
      }
      refetchImages();
    }
  }, [gallery.selectedArea, selectedArea, fs, gallery, updateGallery])

  const useMountEffect = () =>
    useEffect(() => {
      // Get images from the user's public WNFS
      getImagesFromWNFS({ gallery, updateGallery, fs });
    }, []);

  useMountEffect();

  return (
    <section className="overflow-hidden text-gray-700">
      <div className="p-4 mx-auto">
        <div className="flex flex-wrap -m-1 md:-m-2">
          <FileUploadCard />
          {selectedGallery?.map((image: Image, index) => (
            <ImageCard key={index} image={image} openModal={handleOpenModal} />
          ))}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          isModalOpen={!!selectedImage}
          onClose={clearSelectedImage}
        />
      )}
    </section>
  );
};

export default ImageGallery;
