import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PATH_DASHBOARD } from '../../../routes/paths';

export default function Index() {
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.order.root) {
      push(PATH_DASHBOARD.order.list);
    }
  }, [pathname]);

  return null;
}
