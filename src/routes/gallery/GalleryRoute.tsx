import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from "recoil";

import { sessionStore } from '../../stores';
import { AREAS, galleryStore } from "./stores";
import Dropzone from './components/upload/Dropzone';
import ImageGallery from './components/imageGallery/ImageGallery';

const GalleryRoute = () => {
  const navigate = useNavigate();
  const [gallery, setGallery] = useRecoilState(galleryStore);
  const session = useRecoilValue(sessionStore);

  /**
   * Tab between the public/private areas and load associated images
   * @param area
   */
  const handleChangeTab: (area: AREAS) => void = (area) =>
    setGallery({
      ...gallery,
      selectedArea: area,
    });

  // If the user is not authed redirect them to the home page
  useEffect(() => {
    if (!session.loading && !session.authed) {
      navigate('/');
    }
  }, [session, navigate])

  return (
    <div className="p-2 mb-14 text-center">
      {session.authed && (
        <>
          <div className="flex items-center justify-center translate-y-1/2 w-fit m-auto">
            <div className="tabs border-2 overflow-hidden border-base-content rounded-lg">
              {Object.keys(AREAS).map((area, index) => (
                <button
                  key={index}
                  onClick={() => handleChangeTab(AREAS[area as AREAS])}
                  className={`tab h-10 font-bold text-sm ease-in ${
                    gallery.selectedArea === AREAS[area as AREAS]
                      ? "tab-active bg-base-content text-base-100"
                      : "bg-base-100 text-base-content"
                  } ease-in`}
                >
                  {`${AREAS[area as AREAS].charAt(0).toUpperCase()}${AREAS[
                    area as AREAS
                  ]
                    .slice(1)
                    .toLowerCase()}`}{" "}
                  WNFS
                </button>
              ))}
            </div>
          </div>

          <Dropzone>
            <ImageGallery />
          </Dropzone>
        </>
      )}
    </div>
  );
};

export default GalleryRoute;
