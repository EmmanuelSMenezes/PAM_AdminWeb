import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify/Iconify';
import { useSettingsContext } from 'src/components/settings';
import { styleGet, stylePost, stylePut } from 'src/service/setting';
import * as Yup from 'yup';
import FormProvider, { RHFUploadAvatar } from '../../../../components/hook-form';
import { useSnackbar } from '../../../../components/snackbar';
import { CustomFile } from '../../../../components/upload';
import { fData } from '../../../../utils/formatNumber';

type FormValuesProps = {
  logo: CustomFile | string | null;
  color: string;
  light: string;
  lighter: string;
  main: string;
  dark: string;
  darker: string;
  contrasttext: string;
};

export default function AccountPersonalization() {
  const { enqueueSnackbar } = useSnackbar();
  const [styleColors, setStyleColors] = useState<any>(null);
  const { user, signalRStyleConnection } = useAuthContext();
  const { setExternalTheme } = useSettingsContext();

  const [openModalColor, setOpenModalColor] = useState<any>({
    modalLighter: false,
    modalLight: false,
    modalMain: false,
    modalDark: false,
    modalDarker: false,
    modalContrastText: false,
  });
  const [colors, setColors] = useState({
    lighter: '',
    light: '',
    main: '',
    dark: '',
    darker: '',
    contrasttext: '',
  });
  const modalColorDeafult = {
    modalLighter: false,
    modalLight: false,
    modalMain: false,
    modalDark: false,
    modalDarker: false,
    modalContrastText: false,
  };

  const UpdateUserSchema = Yup.object().shape({
    darker: Yup.string().required('Escolha a cor'),
    dark: Yup.string().required('Escolha a cor'),
    main: Yup.string().required('Escolha a cor'),
    light: Yup.string().required('Escolha a cor'),
    lighter: Yup.string().required('Escolha a cor'),
    contrasttext: Yup.string().required('Escolha a cor'),
  });

  const defaultValues = {
    logo: null,
    color: '',
    lighter: '',
    light: '',
    main: '',
    dark: '',
    darker: '',
    contrasttext: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    console.log(typeof data.logo);
    try {
      if (styleColors === null) {
        await stylePost({
          logo: data.logo,
          contrasttext: colors.contrasttext,
          darker: colors.darker,
          dark: colors.dark,
          main: colors.main,
          lighter: colors.lighter,
          light: colors.light,
          admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
        });
      } else if (typeof data.logo === 'string') {
        await stylePut({
          url: data.logo,
          contrasttext: colors.contrasttext,
          darker: colors.darker,
          dark: colors.dark,
          main: colors.main,
          lighter: colors.lighter,
          light: colors.light,
          admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
        });
      } else {
        await stylePut({
          logo: data.logo,
          contrasttext: colors.contrasttext,
          darker: colors.darker,
          dark: colors.dark,
          main: colors.main,
          lighter: colors.lighter,
          light: colors.light,
          admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
        });
      }

      getPlataformStyle();

      if (signalRStyleConnection && signalRStyleConnection.state === 'Connected') {
        signalRStyleConnection.invoke('JoinCommunicationStyle');
      }

      setExternalTheme({
        light: colors.light,
        lighter: colors.lighter,
        main: colors.main,
        dark: colors.dark,
        darker: colors.darker,
        contrastText: colors.contrasttext,
        name: 'default',
      });
      enqueueSnackbar('Dados atualizados com sucesso!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Não foi possivel atualizar usuário', { variant: 'error' });
    }
  };

  const getPlataformStyle = async () => {
    try {
      const response = await styleGet(user?.admin_id);
      localStorage.setItem('GeneralStyle', JSON.stringify(response));
      setExternalTheme(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('logo', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onChangeColor = (selecetedColor: any, colorName: string) => {
    setColors({
      ...colors,
      [colorName]: selecetedColor.hex,
    });
  };

  const handleClick = (selectedModal: string) => {
    setOpenModalColor({
      ...modalColorDeafult,
      [selectedModal]: !openModalColor[selectedModal],
    });
  };

  useEffect(() => {
    async function getFeeAdmin() {
      try {
        const response = await styleGet(user?.isCollaborator ? user?.sponsor_id : user?.admin_id);

        setColors({
          ...colors,
          light: response.light,
          lighter: response.lighter,
          main: response.main,
          dark: response.dark,
          darker: response.darker,
          contrasttext: response.contrasttext,
        });
        setValue('light', response.light);
        setValue('lighter', response.lighter);
        setValue('main', response.main);
        setValue('dark', response.dark);
        setValue('darker', response.darker);
        setValue('contrasttext', response.contrasttext);
        setValue('logo', response.logo, { shouldValidate: true });
        setStyleColors(response);
      } catch {
        console.error('erro teste');
      }
    }
    getFeeAdmin();
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="logo"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Permitido *.jpeg, *.jpg, *.png, *.gif
                  <br /> no tamanho máximo de {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={4}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <Stack spacing={1}>
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Mais Clara - Quadro Dashboard
                </Typography>
                <Stack
                  onClick={() => handleClick('modalLighter')}
                  style={{
                    backgroundColor: `${colors.lighter}`,
                    width: '400px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      colors.lighter === '#ffffff'
                        ? '1px solid #000'
                        : `1px solid ${colors.lighter}`,
                  }}
                >
                  <Iconify
                    icon="eva:color-picker-fill"
                    width={20}
                    color={colors.lighter === '#ffffff' ? '' : 'white'}
                  />
                </Stack>
                {openModalColor.modalLighter && (
                  <Stack sx={{ cursor: 'pointer' }}>
                    <Controller
                      name="lighter"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <ChromePicker
                          color={colors.lighter}
                          {...field}
                          onChangeComplete={(selectedColor) => {
                            onChangeColor(selectedColor, 'lighter');
                            field.onChange(selectedColor.hex);
                          }}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Clara - Cabeçarios
                </Typography>
                <Stack
                  onClick={() => handleClick('modalLight')}
                  style={{
                    backgroundColor: `${colors.light}`,
                    width: '400px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      colors.light === '#ffffff' ? '1px solid #000' : `1px solid ${colors.light}`,
                  }}
                >
                  <Iconify
                    icon="eva:color-picker-fill"
                    width={20}
                    color={colors.light === '#ffffff' ? '' : 'white'}
                  />
                </Stack>
                {openModalColor.modalLight && (
                  <Stack sx={{ cursor: 'pointer' }}>
                    <Controller
                      name="light"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <ChromePicker
                          color={colors.light}
                          {...field}
                          onChangeComplete={(selectedColor) => {
                            onChangeColor(selectedColor, 'light');
                            field.onChange(selectedColor.hex);
                          }}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Principal - Botões e ícones
                </Typography>
                <Stack
                  onClick={() => handleClick('modalMain')}
                  style={{
                    backgroundColor: `${colors.main}`,
                    width: '400px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      colors.main === '#ffffff' ? '1px solid #000' : `1px solid ${colors.main}`,
                  }}
                >
                  <Iconify
                    icon="eva:color-picker-fill"
                    width={20}
                    color={colors.main === '#ffffff' ? '' : 'white'}
                  />
                </Stack>
                {openModalColor.modalMain && (
                  <Stack sx={{ cursor: 'pointer' }}>
                    <Controller
                      name="main"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <ChromePicker
                          color={colors.main}
                          {...field}
                          onChangeComplete={(selectedColor) => {
                            onChangeColor(selectedColor, 'main');
                            field.onChange(selectedColor.hex);
                          }}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Escura - Botão focus
                </Typography>
                <Stack
                  onClick={() => handleClick('modalDark')}
                  style={{
                    backgroundColor: `${colors.dark}`,
                    width: '400px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      colors.dark === '#ffffff' ? '1px solid #000' : `1px solid ${colors.dark}`,
                  }}
                >
                  <Iconify
                    icon="eva:color-picker-fill"
                    width={20}
                    color={colors.dark === '#ffffff' ? '' : 'white'}
                  />
                </Stack>
                {openModalColor.modalDark && (
                  <Stack sx={{ cursor: 'pointer' }}>
                    <Controller
                      name="dark"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <ChromePicker
                          color={colors.dark}
                          {...field}
                          onChangeComplete={(selectedColor) => {
                            onChangeColor(selectedColor, 'dark');
                            field.onChange(selectedColor.hex);
                          }}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Mais Escura - Botão acionado e fonte do dashboard
                </Typography>
                <Stack
                  onClick={() => handleClick('modalDarker')}
                  style={{
                    backgroundColor: `${colors.darker}`,
                    width: '400px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      colors.darker === '#ffffff' ? '1px solid #000' : `1px solid ${colors.darker}`,
                  }}
                >
                  <Iconify
                    icon="eva:color-picker-fill"
                    width={20}
                    color={colors.darker === '#ffffff' ? '' : 'white'}
                  />
                </Stack>
                {openModalColor.modalDarker && (
                  <Stack sx={{ cursor: 'pointer' }}>
                    <Controller
                      name="darker"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <ChromePicker
                          color={colors.darker}
                          {...field}
                          onChangeComplete={(selectedColor) => {
                            onChangeColor(selectedColor, 'darker');
                            field.onChange(selectedColor.hex);
                          }}
                        />
                      )}
                    />
                  </Stack>
                )}
                <Typography sx={{ color: '#919EAB', fontWeight: '400' }}>
                  Contraste do texto
                </Typography>
                <Stack
                  onClick={() => handleClick('modalContrastText')}
                  style={{
                    backgroundColor: `${colors.contrasttext}`,
                    width: '400px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border:
                      colors.contrasttext === '#ffffff'
                        ? '1px solid #000'
                        : `1px solid ${colors.contrasttext}`,
                  }}
                >
                  <Iconify
                    icon="eva:color-picker-fill"
                    width={20}
                    color={colors.contrasttext === '#ffffff' ? '' : 'white'}
                  />
                </Stack>
                {openModalColor.modalContrastText && (
                  <Stack sx={{ cursor: 'pointer' }}>
                    <Controller
                      name="contrasttext"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <ChromePicker
                          color={colors.contrasttext}
                          {...field}
                          onChangeComplete={(selectedColor) => {
                            onChangeColor(selectedColor, 'contrasttext');
                            field.onChange(selectedColor.hex);
                          }}
                        />
                      )}
                    />
                  </Stack>
                )}
              </Stack>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton
                disabled={
                  watch('contrasttext') === '' ||
                  watch('darker') === '' ||
                  watch('dark') === '' ||
                  watch('main') === '' ||
                  watch('light') === '' ||
                  watch('lighter') === '' ||
                  watch('logo') === null
                }
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Salvar Alterações
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
