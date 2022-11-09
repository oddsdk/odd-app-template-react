import { getAvatarFromWNFS, uploadAvatarToWNFS } from '../../lib/account-settings'
import Avatar from './Avatar'

const AvatarUpload = () => {
  /**
   * Handle uploads made by interacting with the file input
   */
  const handleFileInput: (file: File) => Promise<void> = async (file) => {
    await uploadAvatarToWNFS(file);

    // Refetch avatar and update accountSettingsStore
    await getAvatarFromWNFS();
  };

  return (
    <>
      <h3 className="text-lg mb-4">Avatar</h3>
      <div className="flex items-center gap-4">
        <Avatar />

        <label htmlFor="upload-avatar" className="btn btn-outline">
          Upload a new avatar
        </label>
        <input
          onChange={(e) => handleFileInput(e.target.files[0])}
          id="upload-avatar"
          type="file"
          accept="image/*"
          className="hidden"
        />
      </div>
    </>
  );
}

export default AvatarUpload;
