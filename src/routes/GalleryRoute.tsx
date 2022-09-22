import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import GalleryContext, { AREAS } from "../contexts/GalleryContext";
import ThemeContext, { THEME } from '../contexts/ThemeContext'
import SessionContext from '../contexts/SessionContext'
import Dropzone from '../components/gallery/upload/Dropzone'
import ImageGallery from '../components/gallery/imageGallery/ImageGallery'

const GalleryRoute = () => {
  const navigate = useNavigate();
  const { gallery, updateGallery } = useContext(GalleryContext);
  const { session } = useContext(SessionContext);
  const { theme } = useContext(ThemeContext);

  /**
   * Tab between the public/private areas and load associated images
   * @param area
   */
  const handleChangeTab: (area: AREAS) => void = (area) =>
    updateGallery({
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
    <div className="p-2 text-center">
      {session.authed && (
        <>
          <div className="flex mb-4">
            <div
              className={`tabs tabs-boxed w-fit border ${
                theme === THEME.LIGHT ? 'button-transparent' : 'border-primary'
              }`}
            >
              {Object.keys(AREAS).map((area, index) => (
                <button
                  key={index}
                  onClick={() => handleChangeTab(AREAS[area as AREAS])}
                  className={`tab ${gallery.selectedArea === AREAS[area as AREAS]
                    ? 'tab-active'
                    : 'hover:text-primary'} ease-in`}
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
