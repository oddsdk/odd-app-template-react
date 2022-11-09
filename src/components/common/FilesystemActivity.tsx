type Props = {
  activity: 'Initializing' | 'Loading';
}

const FilesystemActivity = ({ activity }: Props) => (
  <>
    <input type="checkbox" id="my-modal-5" checked className="modal-toggle" />
    <div className="modal">
      <div className="modal-box rounded-lg shadow-sm w-narrowModal relative text-center">
        <p className="flex items-center justify-center text-base-content">
          <span className="rounded-lg border-t-2 border-l-2 border-base-content w-4 h-4 inline-block animate-spin mr-2" />
          {activity} file system...
        </p>
      </div>
    </div>
  </>
);

export default FilesystemActivity;
