import type { Image } from "../../lib/gallery";

type Props = {
  image: Image;
  openModal: (image: Image) => void;
};

const ImageCard = ({ image, openModal }: Props) => {
  const handleOpenModal = () => openModal(image);

  return (
    <div
      className="relative group w-full aspect-[22/23] rounded-lg border-2 border-transparent hover:border-base-content box-border overflow-hidden transition-colors ease-in"
      onClick={handleOpenModal}
    >
      <div className="flex items-center justify-center absolute z-10 top-0 right-0 bottom-0 left-0 bg-[#00000035] opacity-0 group-hover:opacity-100 transition-opacity ease-in" />
      <div className="relative pb-[105%]">
        <img
          className="absolute block object-cover object-center w-full h-full"
          alt={image.name}
          src={image.src}
        />
      </div>
    </div>
  );
};

export default ImageCard;
