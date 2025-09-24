import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ICategory, ICategoryResponse, IUpdateCategory } from 'src/@types/category';
import { getCategory, putCategory } from 'src/service/productService';
import * as Yup from 'yup';
import { useAuthContext } from '../../../auth/useAuthContext';
import FormProvider, {
  RHFSelect,
  RHFTextField
} from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { PATH_DASHBOARD } from '../../../routes/paths';

interface FormValuesProps {
  nameCategory: string;
  category: string;
  category_id: string;
  active: boolean;
  update_by: string;
}

type Props = {
  isEdit?: boolean;
  currentCategory?: ICategory;
};

export default function CategoryEditForm({ isEdit = false, currentCategory }: Props) {
  const { push } = useRouter();
  const [categoryData, setCategoryData]= useState<ICategoryResponse[]>();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    nameCategory: Yup.string().required('Nome é obrigatório'),
    category: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      nameCategory: currentCategory?.description || '',
      category: currentCategory?.category_parent_id || '',
      category_id: currentCategory?.category_id || '',
      active: currentCategory?.active,
    }),
    [currentCategory]
  );
console.log(currentCategory?.active)
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentCategory]);
  
  const onSubmit = async (data: FormValuesProps) => {
    console.log(data)
    const categoryUpdate: IUpdateCategory = {
      category_id: data.category_id,
      description: data.nameCategory,
      category_parent_id: data.category || null,
      active: data.active,
      updated_by: user?.user_id,
    };
    try {
      await putCategory(categoryUpdate);
      reset();
      enqueueSnackbar('Categoria atualizado com Sucesso!', { variant: 'success' });
      push(PATH_DASHBOARD.category.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possivel atualizar categoria', { variant: 'error' });
    }
  };

  const getCategoryList = async () => {
    try {
      const response = await getCategory({ filter: '', itensPerPage: 99999, page: 0 });
      setCategoryData(response.categories);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    if (currentCategory) {
      setValue('nameCategory', currentCategory.description || '');
      setValue('category', currentCategory.category_parent_id || '');
    }
  }, [currentCategory, setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="nameCategory" label={currentCategory?.category_parent_id ? "*Nome da subcategoria:" : "*Nome da categoria:"} />
              {currentCategory?.category_parent_id &&
                <RHFSelect native name="category" label="*Selecionar categoria:">
                  <option value="" />
                  {categoryData
                    ?.filter((categoryItem: ICategory) => categoryItem.category_parent_id === null)
                    .map((item: ICategory) => (
                      <option key={item.identifier} value={item.category_id}>
                        {item.description}
                      </option>
                    ))}
                </RHFSelect>
              }
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Salvar Alterações'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
