import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { BackupView } from '../lib/views';
import AreYouSure from '../components/auth/backup/AreYouSure';
import Backup from '../components/auth/backup/Backup';

const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const BackupRoute = () => {
  let query = useQuery();
  const [view, setView] = useState(query.get('view') ?? 'backup');

  const handleChangeView = (updatedView: BackupView) => {
    setView(updatedView);
  };

  if (view === 'backup') {
    return <Backup changeView={handleChangeView} />
  } else if (view === 'are-you-sure') {
    return <AreYouSure />
  }

  return null
};

export default BackupRoute;
