import { Alert, Box, Button, Card, Container, Grid, InputAdornment, Stack, Tooltip } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IChatResponse } from 'src/@types/communication';
import { defaultValuesPartnerArray } from 'src/@types/defaultValuesPartner';
import { IPartnerById, IUpdatePartner } from 'src/@types/partner';
import { iUpdateUser } from 'src/@types/user';
import { useAuthContext } from 'src/auth/useAuthContext';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useChatContext } from 'src/hooks/useChatContext';
import { createChat, getConversations } from 'src/redux/slices/chat';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { deleteUser, updateUser } from 'src/service/auth';
import { getPartnerById, inactiveMassPartner, updatePartner } from 'src/service/partner';
import { maskCnpj, maskCpf, maskPhone, maskZipCode } from 'src/utils/formatForm';
import CustomBreadcrumbs from '../../../../components/custom-breadcrumbs';
import Iconify from '../../../../components/iconify';
import { useSettingsContext } from '../../../../components/settings';
import { useSnackbar } from '../../../../components/snackbar';
import DashboardLayout from '../../../../layouts/dashboard';

type FormValuesProps = {
  legal_name: string;
  email: string;
  password: string;
  phone_number: string;
  document: string;
  branch: {
    branch_name: string;
    document: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      district: string;
      city: string;
      state: string;
      zip_code: string;
      active: boolean;
      created_at: Date;
      deleted_at: Date;
      updated_at: Date;
      latitude: string;
      longitude: string;
    };
  };
  service_fee: string | number,
  card_fee: string | number,
  active: boolean;
  user_id: string;
  afterSubmit?: string;
};

ManagementPartnerPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function ManagementPartnerPage() {
  const { themeStretch } = useSettingsContext();
  const [dataPartner, setDataPartner] = useState<IPartnerById>();
  const [cpf, setCpf] = useState('');
  const formattedCpf = maskCpf(cpf);
  const [cnpj, setCnpj] = useState('');
  const formattedCnpj = maskCnpj(cnpj);
  const [phone, setPhone] = useState('');
  const formattedPhone = maskPhone(phone);
  const [zipCode, setZipCode] = useState('');
  const formattedZipCode = maskZipCode(zipCode);
  const [openDelete, setOpenDelete] = useState(false);
  const [openSuspend, setOpenSuspend] = useState(false);
  const { push } = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { setPreSelectedChat } = useChatContext();

  const handleOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleOpenSuspend = () => {
    setOpenSuspend(true);
  };
  const handleCloseSuspend = () => {
    setOpenSuspend(false);
  };

  const [partner, setPartner] = useState<IPartnerById>({
    partner_id: '',
      legal_name: '',
      fantasy_name: '',
      email: '',
      phone_number: '',
      document: '',
      // identifier: 0,
      branch: [
        {
          branch_id: '',
          branch_name: '',
          document: '',
          phone: '',
          partner_id: '',
          updated_by: user?.user_id || '',
          // created_by: string;
          address: {
            address_id: '',
            street: '',
            number: '',
            complement: '',
            district: '',
            city: '',
            state: '',
            zip_code: '',
            active: true,
            latitude: '',
            longitude: '',
            updated_by: '',
          },
        },
      ],
      active: true,
      user_id: '',
      admin_id: '',
      created_by: '',
      updated_by: '',
      service_fee: 0,
      card_fee: 0,
  });

  const {
    query: { user_id },
  } = useRouter();

  useEffect(() => {
    if (user_id && typeof user_id === 'string') {
      const partnerById = async () => {
        try {
          const partnerData = await getPartnerById(user_id);
          setDataPartner(partnerData);
          setValue('service_fee', String(Number(partnerData.service_fee) * 100));
          setValue('card_fee', String(Number(partnerData.card_fee) * 100));
        } catch {
          console.error('erro teste');
        }
      };
      partnerById();
    }
  }, [user_id]);

  const currentPartner = dataPartner;

  useEffect(() => {
    if (currentPartner) {
      setCpf(currentPartner?.document);
      setCnpj(currentPartner?.branch[0].document);
      setPhone(currentPartner?.phone_number);
      setZipCode(currentPartner?.branch[0]?.address?.zip_code);

      setPartner(currentPartner);
    }
  }, [currentPartner]);

  const handleSuspendRow = async () => {
    try {
      const suspendUserId: iUpdateUser = {
        Email: '',
        Fullname: '',
        Phone: '',
        Document: '',
        User_id: '',
        Active: true,
        Avatar: null,
        Phone_verified: false,
      };
      let activePartner: IUpdatePartner = defaultValuesPartnerArray;
      const suspendPartnerId: string[] = [];
      suspendUserId.Email = partner.email;
      suspendUserId.Fullname = partner.legal_name;
      suspendUserId.Phone = partner.phone_number;
      suspendUserId.Document = partner.document;
      suspendUserId.Active = partner.active;
      suspendUserId.User_id = partner.user_id;
      activePartner = {
        partner_id: partner.partner_id,
        legal_name: partner.legal_name,
        fantasy_name: partner.fantasy_name,
        email: partner.email,
        phone_number: partner.phone_number,
        document: partner.document,
        branch: [
          {
            branch_id: partner.branch[0].branch_id,
            branch_name: partner.branch[0].branch_name,
            document: partner.branch[0].document,
            phone: partner?.branch[0].phone || '',
            partner_id: partner?.branch[0].partner_id || '',
            updated_by: user?.user_id,
            address: {
              address_id: partner.branch[0]?.address?.address_id,
              street: partner.branch[0]?.address?.street,
              number: partner.branch[0]?.address?.number,
              complement: partner.branch[0]?.address?.complement,
              district: partner.branch[0]?.address?.district,
              city: partner.branch[0]?.address?.city,
              state: partner.branch[0]?.address?.state,
              zip_code: partner.branch[0]?.address?.zip_code,
              active: partner.branch[0]?.address?.active,
              latitude: partner.branch[0]?.address?.latitude,
              longitude: partner.branch[0]?.address?.longitude,
              updated_by: user?.user_id || '',
            },
          },
        ],
        active: true,
        user_id: partner.user_id,
        admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
        updated_by: user?.user_id,
      };
      suspendPartnerId.push(partner.partner_id);
      if (partner.active === false) {
        activePartner = {
          ...activePartner,
          // active: true,
        };
        await updateUser({ ...suspendUserId, Active: true });
        await updatePartner(activePartner);
        enqueueSnackbar('Parceiro Ativado com sucesso!', { variant: 'success' });
        setPartner({ ...partner, active: true });
      } else {
        suspendPartnerId.push(partner.partner_id);
        await updateUser({ ...suspendUserId, Active: false });
        await inactiveMassPartner(suspendPartnerId);
        enqueueSnackbar('Parceiro Suspenso com sucesso!', { variant: 'success' });
        setPartner({ ...partner, active: false });
      }
    } catch {
      enqueueSnackbar('Não foi possivel Suspender o Parceiro!', { variant: 'error' });
    }
    setOpenSuspend(false);
  };

  const handleDeleteRow = async () => {
    try {
      if (user_id){
        await deleteUser(user_id);
        enqueueSnackbar('Parceiro Excluido com sucesso!', { variant: 'success' });
        push(PATH_DASHBOARD.partner.list);
      }
    } catch {
      enqueueSnackbar('Não foi possivel excluir o Parceiro!', { variant: 'error' });
    }
    setOpenDelete(false);
  };

  const defaultValues = {
    legal_name: '',
    fantasy_name: '',
    email: '',
    phone_number: '',
    document: '',
    branch: {
      branch_name: '',
      document: '',
      address: {
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: '',
        zip_code: '',
        active: true,
        created_at: new Date(),
        latitude: '',
        longitude: '',
      },
    },
    service_fee: '',
    card_fee: '',
    active: true,
    user_id: '',
    afterSubmit: '',
  };

  const methods = useForm<FormValuesProps>({
    defaultValues,
  });

  const {
    setValue,
    formState: { errors },
  } = methods;

  const handleOpenChatWithPartner = async() => {
    try {
      const chatList = await getConversations(user?.user_id);
      if (dataPartner) {
        const chat = chatList.filter((element: IChatResponse)=> element.closed === null && element.members.includes(dataPartner?.user_id))[0];
        if (chat) {
          setPreSelectedChat(chat.chat_id);
          push(PATH_DASHBOARD.chat.root);
        } else {
          const newChat = await createChat({order_id: null, members: [dataPartner?.user_id, user?.user_id]});
          if (newChat) {
            setPreSelectedChat(newChat.chat_id);
            push(PATH_DASHBOARD.chat.root);
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <>
      <Head>
        <title>Administrador | Gestão de Parceiro</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Gestão de Parceiro"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Parceiros', href: PATH_DASHBOARD.partner.root },
            { name: 'Gestão de Parceiro' },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Tooltip title="Voltar">
                <Button component={NextLink} href={PATH_DASHBOARD.partner.list} size="small" variant="contained">
                  <Iconify icon="pajamas:go-back" />
                </Button>
              </Tooltip>
            </Container>
          }
        />
        <FormProvider methods={methods}>
          <Container sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <Tooltip title="Excluir Parceiro">
              <Button
                sx={{
                  '&:hover': {
                    backgroundColor: 'darkred',
                  },
                }}
                onClick={handleOpenDelete}
                variant="contained"
              >
                <Iconify icon="eva:trash-2-outline" />
              </Button>
            </Tooltip>
            {partner.active === true ? (
              <Tooltip title="Suspender Parceiro">
                <Button
                  sx={{
                    '&:hover': {
                      backgroundColor: 'darkorange',
                    },
                  }}
                  onClick={handleOpenSuspend}
                  variant="contained"
                >
                  <Iconify icon="eva:slash-outline" />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Ativar Parceiro">
                <Button
                  sx={{
                    '&:hover': {
                      backgroundColor: 'darkgreen',
                    },
                  }}
                  onClick={handleOpenSuspend}
                  variant="contained"
                >
                  <Iconify icon="eva:checkmark-square-2-outline" />
                </Button>
              </Tooltip>
            )}
            <Tooltip title="Editar o Parceiro">
              <Button
                sx={{
                  '&:hover': {
                    backgroundColor: 'darkred',
                  },
                }}
                href={PATH_DASHBOARD.partner.edit(partner.user_id)}
                component={NextLink}
                variant="contained"
              >
                <Iconify icon="fluent:edit-16-regular" />
              </Button>
            </Tooltip>
            <Tooltip title="Falar com o Parceiro">
              <Button
                sx={{
                  '&:hover': {
                    backgroundColor: 'darkred',
                  },
                }}
                onClick={handleOpenChatWithPartner}
                variant="contained"
              >
                <Iconify icon="ph:chat-centered-dots-light" />
              </Button>
            </Tooltip>
          </Container>
          <Stack spacing={2.5}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <RHFTextField
                  value={partner?.legal_name}
                  name="legal_name"
                  label="*Nome / Razão social:"
                  type="text"
                  disabled
                />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  
                  sx={{ margin: '22px 0px'}}
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      value={partner?.fantasy_name}
                      name="fantasy_name"
                      label="Nome Fantasia:"
                      type="text"
                      disabled
                    />
                    <RHFTextField
                      value={partner?.email}
                      name="email"
                      label="*E-mail:"
                      type="text"
                      disabled
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      value={formattedPhone}
                      name="phone_number"
                      label="*DDD + Telefone:"
                      type="text"
                      disabled
                    />
                    <RHFTextField
                      value={formattedCpf}
                      name="document"
                      label="*CPF:"
                      type="text"
                      disabled
                      inputProps={{ maxLength: 14 }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      value={partner?.branch[0].branch_name}
                      name="branch.branch_name"
                      label="*Nome Matriz:"
                      type="text"
                      disabled
                    />
                    <RHFTextField
                      value={formattedCnpj}
                      name="branch.document"
                      label="*CNPJ:"
                      type="text"
                      disabled
                      inputProps={{ maxLength: 18 }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      value={partner?.branch[0]?.address?.street}
                      name="branch.address.street"
                      label="*Logradouro:"
                      type="text"
                      disabled
                      sx={{ flex: 2 }}
                    />
                    <RHFTextField
                      value={partner?.branch[0]?.address?.number}
                      name="branch.address.number"
                      label="*Número:"
                      type="text"
                      disabled
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      value={partner?.branch[0]?.address?.complement}
                      name="branch.address.complement"
                      label="Complemento:"
                      type="text"
                      disabled
                    />
                    <RHFTextField
                      value={partner?.branch[0]?.address?.district}
                      name="branch.address.district"
                      label="*Bairro:"
                      type="text"
                      disabled
                    />
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <RHFTextField
                      value={partner?.branch[0]?.address?.city}
                      name="branch.address.city"
                      label="*Cidade:"
                      type="text"
                      disabled
                    />
                    <RHFTextField
                      value={partner?.branch[0]?.address?.state}
                      name="branch.address.state"
                      label="*Estado:"
                      type="text"
                      disabled
                    />
                    <RHFTextField
                      value={formattedZipCode}
                      name="branch.address.zip_code"
                      label="*CEP:"
                      type="text"
                      disabled
                      inputProps={{ maxLength: 9 }}
                    />
                  </Stack>
                </Box>
                <Stack spacing={1} direction="row">  
                  <RHFTextField name="service_fee" label="Taxa de serviço:" disabled  
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            %
                          </Box>
                        </InputAdornment>
                      ),
                  }}/>
                  <RHFTextField name="card_fee" label="Taxa de cartão:" disabled  
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            %
                          </Box>
                        </InputAdornment>
                      ),
                  }}/>
                </Stack>
              </Card>
            </Grid>
          </Stack>
        </FormProvider>
      </Container>
      <ConfirmDialog
        open={openDelete}
        onClose={handleCloseDelete}
        title="Deletar"
        content={<>Tem certeza de que deseja excluir Parceiro?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow();
            }}
          >
            Deletar
          </Button>
        }
      />
      {partner.active === true ? (
        <ConfirmDialog
          open={openSuspend}
          onClose={handleCloseSuspend}
          title="Suspender"
          content={<>Tem certeza de que deseja Suspender Parceiro?</>}
          action={
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                handleSuspendRow();
              }}
            >
              Suspender
            </Button>
          }
        />
      ) : (
        <ConfirmDialog
          open={openSuspend}
          onClose={handleCloseSuspend}
          title="Suspender"
          content={<>Tem certeza de que deseja Ativar Parceiro ?</>}
          action={
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                handleSuspendRow();
              }}
            >
              Ativar
            </Button>
          }
        />
      )}
    </>
  );
}
