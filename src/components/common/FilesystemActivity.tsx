type Props = {
  activity: 'Initializing' | 'Loading';
}

const FilesystemActivity = ({ activity }: Props) => (
  <>
    <input type="checkbox" id="my-modal-5" defaultChecked className="modal-toggle" />
    <div className="modal">
      <div className="modal-box rounded-lg shadow-sm bg-slate-100 w-80 relative text-center dark:bg-slate-900 dark:border-slate-600 dark:border ">
        <p className="text-slate-500 dark:text-slate-50">
          <span className="rounded-lg border-t-2 border-l-2 border-slate-500 dark:border-slate-50 w-4 h-4 inline-block animate-spin mr-1" />
          {activity} file system...
        </p>
      </div>
    </div>
  </>
);

export default FilesystemActivity;
