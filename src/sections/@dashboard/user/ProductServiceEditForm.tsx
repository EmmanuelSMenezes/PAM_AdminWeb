import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
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
import { useRouter } from 'next/router';
import { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ICategory, ICategoryResponse } from 'src/@types/category';
import { iNewProductResponse } from 'src/@types/productService';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { getCategory, postProductImage, putProductService } from 'src/service/productService';
import { coinToNumber, numberToCoin } from 'src/utils/formatCurrency';
import * as Yup from 'yup';
import { useAuthContext } from '../../../auth/useAuthContext';
import FormProvider, {
  RHFRadioGroup,
  RHFTextField,
  RHFUpload
} from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import { CustomFile } from '../../../components/upload';
import { PATH_DASHBOARD } from '../../../routes/paths';


interface FormValuesProps {
  product_id: string;
  name: string;
  description: string;
  minimum_price: string | number;
  note: string;
  type: string;
  image: CustomFile | string;
  category: any;
}

const ITEM_OPTION = [
  { label: 'Produto', value: 'p' },
  { label: 'Serviço', value: 's' },
];

type Props = {
  isEdit?: boolean;
  currentProduct: iNewProductResponse;
};

export default function ProductEditForm({ isEdit = false, currentProduct }: Props) {
  const { themeStretch } = useSettingsContext();
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<ICategory[]>([]);
  const [subcategories, setSubcategories] = useState<ICategoryResponse[]>([]);
  const [isDisabledCategory, setIsDisabledCategory] = useState(false);
  const [isDisabledSubcategory, setIsDisabledSubcategory] = useState(false);
  const { user, signalRConnection } = useAuthContext();
  const { push } = useRouter();

  const [file, setFile] = useState<any>(undefined);


  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    type: Yup.string().required('Selecione o tipo de item'),
    name: Yup.string().required('Nome é obrigatório'),
    description: Yup.string().required('Descrição é obrigatória'),
    minimum_price: Yup.string().required('Preço mínimo é obrigatório'),
    category: Yup.array()
    .of(Yup.object().shape({ description: Yup.string().required('Selecione pelo menos uma categoria') }))
    .min(1, 'Selecione pelo menos uma categoria'),
  });

  const defaultValues = useMemo(
    () => ({
      type: currentProduct?.product.type,
      name: currentProduct?.product.name,
      product_id: currentProduct?.product.product_id,
      description: currentProduct?.product.description,
      minimum_price: currentProduct?.product.minimum_price,
      note: currentProduct?.product.note,
      active: currentProduct?.product.active,
      updated_by: user?.user_id,
      category: currentProduct?.product.categories,
      image: currentProduct?.product.url,
    }),
    [currentProduct, user]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    getValues,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const getCategories = async () => {
    try {
      const response = await getCategory({ filter: '', itensPerPage: 9999, page: 0 });
      const filterCategories = response.categories.filter(
        (obj: ICategory) => obj.category_parent_id === null
      );
      const filterSubcategories = response.categories.filter(
        (obj: ICategory) => obj.category_parent_id !== null
      );
      setCategories(filterCategories);
      setSubcategories(filterSubcategories);
      const selectedCurrentCategories = currentProduct?.product.categories.filter((element: ICategory)=> element.category_parent_id === null );
      const selectedCurrentSubCategories = currentProduct?.product.categories.filter((element: ICategory)=> element.category_parent_id !== null );
      if (selectedCurrentCategories) {
        setSelectedCategories(selectedCurrentCategories);
      }
 
      if (selectedCurrentSubCategories) {
        setSelectedSubCategories(selectedCurrentSubCategories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onSubmit = async (data: FormValuesProps) => {
    const concatCategories = selectedCategories?.concat(selectedSubCategories);
    const categoriesArray: any = [];
    concatCategories.forEach((value: any) => {
      categoriesArray.push({
        category_id: value.category_id,
        category_parent_id: value.category_parent_id,
      });
    });
    
    try {
      const updateProduct = await putProductService({
        product_id: currentProduct?.product.product_id,
        name: data.name,
        type: data.type,
        description: data.description,
        minimum_price: data.minimum_price,
        note: data.note,
        category: categoriesArray,
        active: true,
        updated_by: user?.user_id
      });
      if(data.image !== currentProduct?.product.url){
        await postProductImage({Image: data.image, product_id: updateProduct.product.product_id });
      }
      
      signalRConnection?.invoke('RefreshProductListOnPartner');
      enqueueSnackbar('Item atualizado com Sucesso!', { variant: 'success' });
      push(PATH_DASHBOARD.productService.list);
    } catch (error) {
      enqueueSnackbar('Não foi possivel atualizar o Item', { variant: 'error' });
    }
  };
  
  const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
    const fileImage = acceptedFiles[0];
    setFile(Object.assign(fileImage, {
      preview: URL.createObjectURL(fileImage),
    }));
    setValue('image', fileImage);
  }, [setValue]);

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


  let selectedItensListSub: ICategory[] = [];

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
        onChange={(_e: SyntheticEvent<Element, Event>, elementsSubcategories: any) => {
          setSelectedSubCategories(elementsSubcategories);
        }}
        // eslint-disable-next-line consistent-return
        isOptionEqualToValue={(option: any) => {
          if (selectedItensListSub.includes(option.description)) {
           return option;
          }
       }}
        freeSolo
        // eslint-disable-next-line @typescript-eslint/no-shadow
        renderTags={(elementsSubcategories: readonly ICategory[], getTagProps) =>
          elementsSubcategories.map((option: ICategory, index: number) => (
            <Chip variant="outlined" label={option.description} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Subcategorias" placeholder="Subcategorias" />
        )}
      />
    ),
    [selectedCategories, selectedSubCategories, setSelectedCategories, setSelectedSubCategories]
  );

   let selectedItensList: ICategory[] = [];

  useEffect(() => {
    selectedItensList = [];
    selectedCategories.forEach((element: any) => {
    selectedItensList.push(element.description);
    });
  }, [selectedCategories]);

  useEffect(() => {
    selectedItensListSub = [];
    selectedSubCategories.forEach((element: any) => {
    selectedItensListSub.push(element.description);
    });
  }, [selectedSubCategories]);

  useEffect(()=> {
    const categoriesSelected = selectedCategories;
    const oldCategories = currentProduct.product.categories.filter(
      (obj: ICategory) => obj.category_parent_id === null
    );

    const subcategoriesSelected = selectedSubCategories.filter(
      (obj: ICategory) => obj.category_parent_id !== null
    );;
    const oldSubcategories = currentProduct.product.categories.filter(
      (obj: ICategory) => obj.category_parent_id !== null
    );

    const isEqualCategories = categoriesSelected.length === oldCategories.length &&
      categoriesSelected.every((value, index) => value === oldCategories[index])

    const isEqualSubCategories = subcategoriesSelected.length === oldSubcategories.length &&
      subcategoriesSelected.every((value, index) => value === oldSubcategories[index])

    setIsDisabledCategory(isEqualCategories)
    setIsDisabledSubcategory(isEqualSubCategories)
    
  }, [selectedCategories, selectedSubCategories])
  

  return (
    <>
      <Head>
        <title>Administrador | Editar {currentProduct?.product.type === 'p' ? 'Produto' : 'Serviço'}</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading= "Edição"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Produtos e Serviços', href: PATH_DASHBOARD.productService.list },
            { name: currentProduct?.product.name },
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
          <Grid container spacing={3}>
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
                  <RHFRadioGroup row spacing={4} name="type" options={ITEM_OPTION} />
                  <RHFTextField name="name"  label="*Nome:" />
                  <RHFTextField multiline rows={5} label="*Descrição:" name="description" />
                  <Controller
                    name="category"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      id="tags-filled"
                      options={categories}
                      getOptionLabel={(option: any) => option.description}
                      defaultValue={[categories[1]]}
                      value={selectedCategories}
                      // ignorar 
                      onChange={(_e: SyntheticEvent<Element, Event>, elementsCategories: any[]) => {
                        if (elementsCategories.length < selectedCategories?.length) {
                          setSelectedSubCategories(
                            selectedSubCategories?.filter((value) =>
                            elementsCategories.map((m) => m.category_id).includes(value.category_parent_id)
                            )
                          );
                        }
                        setSelectedCategories(elementsCategories);
                        setValue('category', elementsCategories)
                      }}
                      // eslint-disable-next-line consistent-return
                      isOptionEqualToValue={(option: any) => {
                        if (selectedItensList.includes(option.description)) {
                          return option;
                        }
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

                  <RHFTextField
                    name="minimum_price"
                    label="*Preço mínimo:"
                    placeholder=""
                    value={`R$ ${numberToCoin(getValues('minimum_price').toString())}`}
                    onChange={(e) => setValue('minimum_price', coinToNumber(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                  />
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                      *Imagem sugerida do item:
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <RHFUpload name="image" file={getValues('image') || file}  onDrop={handleDropSingleFile} maxSize={3145728} disableMultiple thumbnail/>
                    </Stack>
                  </Stack>
                  <RHFTextField name="note" label="Informações adicionais ou observações"  />
                </Box>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" disabled={watch('name') === currentProduct?.product.name && 
                  watch('type') === currentProduct?.product.type &&
                  watch('description') === currentProduct?.product.description && 
                  watch('minimum_price') === currentProduct?.product.minimum_price &&
                  getValues('image') === currentProduct.product.url &&
                  isDisabledCategory && isDisabledSubcategory}  
                  variant="contained" loading={isSubmitting}>
                    Salvar Alterações
                  </LoadingButton>

                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </>                  
  );
}
