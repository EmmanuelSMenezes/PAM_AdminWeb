import { Button, Container, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ICategoryResponse } from 'src/@types/category';
import Iconify from 'src/components/iconify';
import { getCategoryById } from 'src/service/productService';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../../components/settings';
import DashboardLayout from '../../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import CategoryEditForm from '../../../../sections/@dashboard/user/CategoryEditForm';

CategoryEditPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CategoryEditPage() {
  const { themeStretch } = useSettingsContext();
  const [dataCategory, setDataCategory] = useState<ICategoryResponse>();

  const {
    query: { category_id },
  } = useRouter();

  useEffect(() => {
    if (category_id && typeof category_id === 'string') {
      const categoryById = async () => {
        try {
          const categoryData = await getCategoryById(category_id);
          setDataCategory(categoryData[0]);
        } catch {
          console.error('erro teste');
        }
      };
      categoryById();
    }
  }, [category_id]);

  const currentCategory = dataCategory;

  return (
    <>
      <Head>
        <title>Administrador | Editar Categoria</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Editar Categoria"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Categorias',
              href: PATH_DASHBOARD.category.list,
            },
            { name: currentCategory?.category_parent_id ? "Subcategoria" : "Categoria" },
          ]}
          action={
            <Tooltip title="Voltar">
              <Button component={NextLink} href={PATH_DASHBOARD.category.list} size="small" variant="contained">
                <Iconify icon="pajamas:go-back" />
              </Button>
            </Tooltip>
          }
        />
        <CategoryEditForm isEdit currentCategory={currentCategory} />
      </Container>
    </>
  );
}
