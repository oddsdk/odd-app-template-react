import type { Image } from '../../../contexts/GalleryContext'

type Props = {
  image: Image;
  openModal: (image: Image) => void;
}

const ImageCard = ({ image, openModal }: Props) => {
const handleOpenModal = () => openModal(image);

  return (
    <div className="flex flex-wrap w-1/2 sm:w-1/4 lg:w-1/6">
      <div
        className="relative group w-full m-1 md:m-2 rounded-lg border-4 border-transparent hover:border-primary overflow-hidden transition-colors ease-in"
        onClick={handleOpenModal}
      >
        <div
          className="flex items-center justify-center absolute z-10 top-0 right-0 bottom-0 left-0 bg-[#00000035] opacity-0 group-hover:opacity-100 transition-opacity ease-in"
        />
        <div className="relative pb-[100%]">
          <img
            className="absolute block object-cover object-center w-full h-full"
            alt={image.name}
            src={image.src}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
