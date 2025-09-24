import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSettingsContext } from 'src/components/settings';
import { styleGet } from 'src/service/setting';
import { PATH_AFTER_LOGIN } from '../../config-global';
import { PATH_DASHBOARD } from '../../routes/paths';

export default function Index() {
  const { pathname, replace, prefetch } = useRouter();
  const { setExternalTheme } = useSettingsContext();
  const { user, token} = useAuthContext();

  const getPlataformStyle = async () => {
    try {
      const response = await styleGet(user?.admin_id);
      localStorage.setItem('GeneralStyle', JSON.stringify(response));
      setExternalTheme(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && token) {
      getPlataformStyle();
    }
  }, [getPlataformStyle]);

  useEffect(() => {
    if (pathname === PATH_DASHBOARD.root) {
      replace(PATH_AFTER_LOGIN);
    }
  }, [pathname]);

  useEffect(() => {
    prefetch(PATH_AFTER_LOGIN);
  }, []);

  return null;
}
