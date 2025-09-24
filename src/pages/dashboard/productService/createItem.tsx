import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  Chip,
  Container,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Head from 'next/head';
import NextLink from 'next/link';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ICategory, ICategoryResponse } from 'src/@types/category';
import { ICategoryPost } from 'src/@types/productService';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify';
import { getCategory, postProductImage, postProductService } from 'src/service/productService';
import { coinToNumber, numberToCoin } from 'src/utils/formatCurrency';
import * as Yup from 'yup';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import FormProvider, {
  RHFRadioGroup,
  RHFTextField,
  RHFUpload
} from '../../../components/hook-form';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import { CustomFile } from '../../../components/upload';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

const ITEM_OPTION = [
  { label: 'Produto', value: 'p' },
  { label: 'Serviço', value: 's' },
];

interface FormValuesProps {
  name:  string,
  option: string,
  description: string, 
  category:  any,
  subcategory:  string,
  lowestPrice: number | string, 
  additionalInformation:  string,
  images: CustomFile | File | string;
}

const categoryDefaultValue = {
  category_id: '',
  identifier: 0,
  description: '',
  category_parent_name: '',
  category_parent_id: '',
  created_by: '',
  updated_by: '',
  created_at: '',
  updated_at: '',
  active: true,
};

const defaultValuesCategory = {
  option: '',
  name: '',
  description: '',
  category: '',
  lowestPrice: '',
  images: undefined,
  additionalInformation: '',
}


CreateProduct.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CreateProduct() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState<ICategoryResponse[]>([categoryDefaultValue]);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ICategoryResponse[]>([categoryDefaultValue]);
  const [price, setPrice] = useState('');
  const { user, signalRConnection } = useAuthContext();

  const [file, setFile] = useState<any>(undefined);

  const NewProductSchema = Yup.object().shape({
    option: Yup.string().required('Selecione o tipo de item'),
    name: Yup.string().required('Nome é obrigatório'),
    description: Yup.string().required('Descrição é obrigatória'),
    lowestPrice: Yup.number().required('Preço mínimo é obrigatório'),
    category: Yup.array()
    .of(Yup.object().shape({ description: Yup.string().required('Selecione pelo menos uma categoria') }))
    .min(1, 'Selecione pelo menos uma categoria'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewProductSchema),
    defaultValues: defaultValuesCategory,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const getCategories = async () => {
    try {
      const response = await getCategory({ filter: '', itensPerPage: 9999, page: 0 });
      const filterCategories = response.categories.filter(
        (obj: ICategory) => obj.category_parent_id === null
      ).filter((element: ICategory) => element.active !== false );
      const filterSubcategories = response.categories.filter(
        (obj: ICategory) => obj.category_parent_id !== null
      ).filter((element: ICategory) => element.active !== false );

      setCategories(filterCategories);
      setSubcategories(filterSubcategories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const concatCategories = selectedCategories?.concat(selectedSubCategories);
    const categoriesArray: ICategoryPost[] = [];
    concatCategories.forEach((value: ICategoryPost) => {
      categoriesArray.push({
        category_id: value.category_id,
        category_parent_id: value.category_parent_id,
      });
    });

    try {
      const newProduct = await postProductService({
        type: data.option,
        name: data.name,
        description: data.description,
        category: categoriesArray,
        minimum_price: price,
        note: data.additionalInformation,
        created_by: user?.user_id,
        admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
      });
      signalRConnection?.invoke('RefreshProductListOnPartner');
     await postProductImage({Image: file, product_id: newProduct.product.product_id });
      enqueueSnackbar('Cadastro realizado com sucesso!', { variant: 'success' });
      reset();
      setSelectedCategories([]);
      setSelectedSubCategories([]);
      setPrice('');
      setFile(undefined);
    } catch (error) {
      enqueueSnackbar('Não foi possivel cadastrar. Verifique os campos e tente novamente!', {
        variant: 'error',
      });
    }
  };

  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const fileImage = acceptedFiles[0];
    if (fileImage) {
      setFile(
        Object.assign(fileImage, {
          preview: URL.createObjectURL(fileImage),
        })
      );
    }
    setValue('images', fileImage)
  }, []);


  const verifyDisabledCategory = useCallback(
    (category_id: string) =>
      selectedCategories
        ?.map((selectedCategory) => selectedCategory.category_id)
        ?.includes(category_id),
    [selectedCategories]
  );

  const filterSubCategoriesBasedOnSelectedCategories = useCallback(
    (category_parent_id: string) =>
      category_parent_id !== null && verifyDisabledCategory(category_parent_id),
    [verifyDisabledCategory]
  );

  const SubCategoriesAutoComplete = useCallback(
    () => (
      <Autocomplete
        multiple
        id="tags"
        options={subcategories.filter((filteredCategory: ICategory) =>
          filterSubCategoriesBasedOnSelectedCategories(filteredCategory.category_parent_id)
        )}
        getOptionLabel={(option: any) => option.description}
        defaultValue={[]}
        value={selectedSubCategories}
        // ignorar
        onChange={(_e: SyntheticEvent<Element, Event>, elementsSubcategories: any[]) => {
          subcategories.forEach((subCategoryExisting) => {
            if (subCategoryExisting.description === elementsSubcategories[elementsSubcategories.length - 1]?.description || elementsSubcategories.length === 0) {
              setSelectedSubCategories(elementsSubcategories);
            }
          })
        }}
        freeSolo
        // eslint-disable-next-line @typescript-eslint/no-shadow
        renderTags={(elementsSubcategories: readonly ICategory[], getTagProps) =>
          elementsSubcategories.map((option: ICategory, index: number) => (
            <Chip variant="outlined" label={option.description} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Subcategorias:" placeholder="Subcategorias" />
        )}
      />
    ),
    [selectedCategories, selectedSubCategories, setSelectedCategories, setSelectedSubCategories]
  );

  return (
    <>
      <Head>
        <title> Ecommerce: Create a new product | Minimal UI</title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Cadastrar"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Produtos e serviços', href: PATH_DASHBOARD.productService.root },
            { name: 'Cadastrar' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Tooltip title="Voltar">
                <Button component={NextLink} href={PATH_DASHBOARD.productService.list} size="small" variant="contained">
                  <Iconify icon="pajamas:go-back" />
                </Button>
              </Tooltip>
            </Container>
          }
        />
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFRadioGroup row spacing={4} name="option" options={ITEM_OPTION} />
                <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1}>
                  <RHFTextField name="name" label="*Nome:" />
                </Stack>

                <Stack direction={{ xs: 'row', sm: 'row' }} spacing={1}>
                  <Stack sx={{ width: '100%' }} spacing={1}>
                  <RHFTextField multiline rows={5} label="*Descrição:" name="description" />
                  </Stack>
                </Stack>
                <Controller
                  name="category"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    multiple
                    id="tags-filled"
                    options={categories}
                    getOptionLabel={(option: any) => option.description}
                    defaultValue={[]}
                    value={selectedCategories}
                    // ignorar 
                    onChange={(_e: SyntheticEvent<Element, Event>, elementsCategories: any[]) => {
                      if (elementsCategories.length < selectedCategories?.length) {
                        setSelectedSubCategories(
                          selectedSubCategories?.filter((value) =>
                          elementsCategories.map((element: any) => element.category_id).includes(value.category_parent_id)
                          )
                        );
                      }
                      categories.forEach((categoryExisting) => {
                        if (categoryExisting.description === elementsCategories[elementsCategories.length - 1]?.description || elementsCategories.length === 0) {
                          setSelectedCategories(elementsCategories);
                          setValue('category', elementsCategories);
                        }
                      })
                    }}
                    freeSolo
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    renderTags={(element: readonly ICategory[], getTagProps) =>
                      element.map((option: ICategory, index: number) => (
                        <Chip
                          variant="outlined"
                          label={option.description}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputRef={ref}
                        name="category"
                        label="*Categorias:"
                        placeholder="Categorias"
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  )}
                />

                <SubCategoriesAutoComplete />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <RHFTextField
                    name="lowestPrice"
                    label="*Preço mínimo:"
                    value={`R$ ${numberToCoin(price)}`}
                    placeholder=""
                    onChange={(e) => {setValue('lowestPrice', coinToNumber(e.target.value)); setPrice(coinToNumber(e.target.value))}}
                    InputLabelProps={{ shrink: true }}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    *Imagem sugerida do item:
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFUpload name="images" file={file} error={!!errors.images} helperText={errors.images?.message} onDrop={handleDropSingleFile}/>
                  </Stack>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <RHFTextField
                    name="additionalInformation"
                    label="Informações adicionais ou observações:"
                  />
                </Stack>
              </Stack>
            </Card>

            <Stack spacing={3}>
              <LoadingButton type="submit" 
              disabled={watch('name') === '' || watch('option') === '' ||
              watch('description') === '' || watch('lowestPrice') === '' || file === undefined
              || selectedCategories.length === 0 } 
              variant="contained" size="medium" 
              loading={isSubmitting}>
                Criar {watch('option') === 'p' ? 'Produto': 'Serviço'}
              </LoadingButton>
            </Stack>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
