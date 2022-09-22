import * as uint8arrays from 'uint8arrays';
import * as wn from 'webnative';
import type FileSystem from "webnative/fs/index";

import { AREAS, type GALLERY, GALLERY_DIRS } from '../contexts/GalleryContext'
import {  type Notification } from '../contexts/NotificationsContext'
import { addNotification } from '../lib/notifications';

const FILE_SIZE_LIMIT = 5;

/**
 * Get images from the user's WNFS and construct the `src` value for the images
 */
type GetParams = {
  gallery: GALLERY;
  updateGallery: (gallery: GALLERY) => void;
  fs: FileSystem | null;
};
export const getImagesFromWNFS: (params: GetParams) => Promise<void> = async ({
  gallery,
  updateGallery,
  fs,
}) => {
  try {
    if (!fs) return;

    // Set loading: true on the galleryStore
    updateGallery({ ...gallery, loading: true });

    const { selectedArea } = gallery;
    const isPrivate = selectedArea === AREAS.PRIVATE;

    // Set path to either private or public gallery dir
    const path = wn.path.directory(...GALLERY_DIRS[selectedArea]);

    // Get list of links for files in the gallery dir
    const links = await fs.ls(path);

    const images = await Promise.all(
      Object.entries(links).map(async ([name]) => {
        const file = await fs.get(
          wn.path.file(...GALLERY_DIRS[selectedArea], `${name}`)
        );

        // The CID for private files is currently located in `file.header.content`,
        // whereas the CID for public files is located in `file.cid`
        const cid = isPrivate
          ? (file as any)?.header.content.toString()
          : (file as any)?.cid.toString();

        // Create a base64 string to use as the image `src`
        const src = `data:image/jpeg;base64, ${uint8arrays.toString(
          (file as any)?.content,
          "base64"
        )}`;

        return {
          cid,
          ctime: (file as any)?.header.metadata.unixMeta.ctime,
          name,
          private: isPrivate,
          size: (links[name] as any).size,
          src,
        };
      })
    );

    // Sort images by ctime(created at date)
    // NOTE: this will eventually be controlled via the UI
    images.sort((a, b) => b.ctime - a.ctime);

    // Push images to the galleryStore
    updateGallery({
      ...gallery,
      ...(isPrivate
        ? {
            privateImages: images,
          }
        : {
            publicImages: images,
          }),
      loading: false,
    });
  } catch (error) {
    updateGallery({
      ...gallery,
      loading: false,
    });
  }
};

/**
 * Upload an image to the user's private or public WNFS
 * @param image
 */
type UploadParams = {
  image: File;
  gallery: GALLERY;
  fs: FileSystem | null;
  notifications: Notification[];
  updateNotifications: (notifications: Notification[]) => void;
};
export const uploadImageToWNFS: (params: UploadParams) => Promise<void> = async ({ image, gallery, fs, notifications, updateNotifications }) => {
  try {
    if (!fs) return;

    const { selectedArea } = gallery;

    // Reject files over 5MB
    const imageSizeInMB = image.size / (1024 * 1024);
    if (imageSizeInMB > FILE_SIZE_LIMIT) {
      throw new Error("Image can be no larger than 5MB");
    }

    // Reject the upload if the image already exists in the directory
    const imageExists = await fs.exists(
      wn.path.file(...GALLERY_DIRS[selectedArea], image.name)
    );
    if (imageExists) {
      throw new Error(`${image.name} image already exists`);
    }

    // Create a sub directory and add some content
    await fs.write(
      wn.path.file(...GALLERY_DIRS[selectedArea], image.name),
      image
    );

    // Announce the changes to the server
    await fs.publish();

    addNotification({ notification: { msg: `${image.name} image has been published`, type: 'success'}, notifications, updateNotifications });
  } catch (error) {
    addNotification({ notification: { msg: (error as any).message, type: 'error'}, notifications, updateNotifications });
  }
};

/**
 * Delete an image from the user's private or public WNFS
 * @param name
 */
type DeleteParams = {
  name: string;
  gallery: GALLERY;
  updateGallery: (gallery: GALLERY) => void;
  fs: FileSystem | null;
  notifications: Notification[];
  updateNotifications: (notifications: Notification[]) => void;
};
export const deleteImageFromWNFS: (params: DeleteParams) => Promise<void> = async ({ name, gallery, updateGallery, fs, notifications, updateNotifications }) => {
  try {
    if (!fs) return;

    const { selectedArea } = gallery;

    const imageExists = await fs.exists(
      wn.path.file(...GALLERY_DIRS[selectedArea], name)
    );

    if (imageExists) {
      // Remove images from server
      await fs.rm(wn.path.file(...GALLERY_DIRS[selectedArea], name));

      // Announce the changes to the server
      await fs.publish();

      addNotification({ notification: { msg: `${name} image has been deleted`, type: 'success' }, notifications, updateNotifications });

      // Refetch images and update galleryStore
      await getImagesFromWNFS({ gallery, updateGallery, fs });
    } else {
      throw new Error(`${name} image has already been deleted`);
    }
  } catch (error) {
    addNotification({ notification: { msg: (error as any).message, type: 'error' }, notifications, updateNotifications });
  }
};

/**
 * Handle uploads made by interacting with the file input directly
 */
type HandleParams = {
  files: FileList | null;
  gallery: GALLERY;
  updateGallery: (gallery: GALLERY) => void;
  fs: FileSystem | null;
  notifications: Notification[];
  updateNotifications: (notifications: Notification[]) => void;
};
export const handleFileInput: (params: HandleParams) => Promise<void> = async ({
  files,
  gallery,
  updateGallery,
  fs,
  notifications,
  updateNotifications,
}) => {
  if (!files) return

  const contextParams = {
    gallery,
    updateGallery,
    fs,
    notifications,
    updateNotifications,
  };

  await Promise.all(
    Array.from(files).map(async (file) => {
      await uploadImageToWNFS({ image: file, ...contextParams });
    })
  );

  // Refetch images and update galleryStore
  await getImagesFromWNFS(contextParams);
};
