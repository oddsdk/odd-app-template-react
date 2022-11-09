import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { AREAS, galleryStore } from "../../stores";
import { getImagesFromWNFS, type Image } from "../../lib/gallery";
import FileUploadCard from "../upload/FileUploadCard";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";

const ImageGallery = () => {
  const gallery = useRecoilValue(galleryStore);

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
    if (!gallery.loading && selectedArea !== gallery.selectedArea) {
      const refetchImages = async () => {
        setSelectedArea(gallery.selectedArea);
        await getImagesFromWNFS();
      };
      refetchImages();
    }
    // eslint-disable-next-line
  }, [gallery.selectedArea, selectedArea]);

  const useMountEffect = () =>
    useEffect(() => {
      // Get images from the user's public WNFS
      getImagesFromWNFS();
    }, []);

  useMountEffect();

  return (
    <section className="overflow-hidden text-gray-700">
      <div className="pt-8 p-6 md:p-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:lg:grid-cols-6 gap-4">
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
