import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Button, Card, Container, Grid, Stack, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICategory } from 'src/@types/category';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify/Iconify';
import { getCategory, postCategory } from 'src/service/productService';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, { RHFRadioGroup, RHFSelect, RHFTextField } from '../../../components/hook-form';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface FormValuesProps {
  nameCategory: string;
  category: string;
  option: string;
}

const defaultValues = {
  nameCategory: '',
  category: '',
  option: ''
}

const ITEM_OPTION = [
  { label: 'Categoria', value: 'Categoria' },
  { label: 'Subcategoria', value: 'Subcategoria' },
];

CreateCategory.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CreateCategory() {
  const { themeStretch } = useSettingsContext();
  const [categoryData, setCategoryData] = useState<ICategory[]>();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { push } = useRouter();


  const NewProductSchema = Yup.object().shape({
    nameCategory: Yup.string().required('Nome é obrigatório'),
    category: Yup.string(),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const getCategoryList = async () => {
    try {
      const response = await getCategory({ filter: '', page: 0, itensPerPage: 99999 });
      setCategoryData(response.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    try {
        await postCategory({
        description: data.nameCategory,
        category_parent_id: data.category || null,
        created_by: user?.user_id,
      });
      reset();
      setValue('nameCategory', '')
      setValue('category', '')
      enqueueSnackbar('Categoria cadastrada com sucesso!', { variant: 'success' });
      push(PATH_DASHBOARD.category.list);
    } catch (error) {
      console.log(error, 'error');
      enqueueSnackbar(
        'Não foi possivel cadastrar a Categoria. Verifique os campos e tente novamente!',
        { variant: 'error' }
      );
    }
  };

  return (
    <>
      <Head>
        <title>Administrador | Cadastrar {watch('option')} </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={`Cadastrar ${watch('option')}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Categorias', href: PATH_DASHBOARD.category.list },
            { name: `Cadastrar ${watch('option')}`},
          ]}
          action={
            <Tooltip title="Voltar">
              <Button component={NextLink} href={PATH_DASHBOARD.category.list} size="small" variant="contained">
                <Iconify icon="pajamas:go-back" />
              </Button>
            </Tooltip>
          }
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
              <RHFRadioGroup row spacing={4} name="option" options={ITEM_OPTION} />
                <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1}>
                {watch('option') && 
                  <RHFTextField name="nameCategory" label={watch('option') === 'Categoria' ? "*Nome da categoria:" : "*Nome da subcategoria:"} />
                }
                </Stack>
                {watch('option') === 'Subcategoria' && 
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFSelect native name="category" label="*Selecionar categoria:">
                      <option value="" />
                      {categoryData
                        ?.filter((element: ICategory) => element.category_parent_id === null)
                        .map((item: ICategory) => (
                          <option key={item.identifier} value={item.category_id}>
                            {item.description}
                          </option>
                        ))}
                    </RHFSelect>
                  </Stack>
                }
              </Stack>
            </Card>

            <Stack spacing={3}>
              <LoadingButton type="submit" variant="contained" disabled={watch('nameCategory') === ''} size="medium" loading={isSubmitting}>
              Criar {watch('option')}
              </LoadingButton>
            </Stack>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
