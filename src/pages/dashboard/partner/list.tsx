import { Icon } from '@iconify/react';
import {
  Button, Card, Container,
  IconButton, Table, TableBody, TableContainer, Tooltip
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IChatResponse } from 'src/@types/communication';
import { defaultValuesPartnerArray } from 'src/@types/defaultValuesPartner';
import { IPartner, IUpdatePartner } from 'src/@types/partner';
import { iUpdateUser } from 'src/@types/user';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useChatContext } from 'src/hooks/useChatContext';
import { createChat, getConversations } from 'src/redux/slices/chat';
import { deleteUser, updateUser } from 'src/service/auth';
import { getPartnerList, inactiveMassPartner, updatePartner } from 'src/service/partner';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import {
  emptyRows, TableEmptyRows,
  TableHeadCustom, TableNoData, TablePaginationCustom, TableSelectedAction, useTable
} from '../../../components/table';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';
import PartnerTableRow from '../../../sections/@dashboard/user/list/PartnerTableRow';
import PartnerTableToolbar from '../../../sections/@dashboard/user/list/PartnerTableToolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Nome/Razão Social', align: 'left' },
  { id: 'document', label: 'CPF/CNPJ', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'id', label: 'Id', align: 'center' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

UserListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function UserListPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { push } = useRouter();
  const [tableData, setTableData] = useState<IPartner[]>([]);
  const [filterRole, setFilterRole] = useState('all');
  const [openConfirm, setOpenConfirm] = useState(false);
  const { user, signalRConnection, token } = useAuthContext();
  const [openConfirmSuspend, setOpenConfirmSuspend] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [totalRows, setTotalRows] = useState(0)
  const { enqueueSnackbar } = useSnackbar();
  const { setPreSelectedChat } = useChatContext()
  const [filter, setFilter] = useState('');

  const isFiltered = filter !== '' || filterRole !== 'all' || filterStatus !== 'Todos';

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirmSuspend = () => {
    setOpenConfirmSuspend(true);
  };
  const handleCloseConfirmSuspend = () => {
    setOpenConfirmSuspend(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilter(event.target.value)
  };

  const handleOpenChatWithPartner = async(user_id: string) => {
    setIsLoading(true);
    try {
      const chatList = await getConversations(user?.user_id);
      const chat = chatList.filter((chatItem: IChatResponse)=> chatItem.closed === null && chatItem.members.includes(user_id))[0];
      if (chat) {
        setPreSelectedChat(chat.chat_id);
        push(PATH_DASHBOARD.chat.root);
      } else {
        const newChat = await createChat({order_id: null, members: [user_id, user?.user_id]});
        if (newChat) {
          setPreSelectedChat(newChat.chat_id);
          push(PATH_DASHBOARD.chat.root);
        }
      }
    } catch (error) {
      enqueueSnackbar('Não foi possivel falar com o Parceiro!', { variant: 'error' });
    }
  }
  
  const changePage = 5 * page - totalRows;

  const handleDeleteRow = async (id: string, user_id: string) => {
    const userFilter = tableData.filter((element)=> element.partner_id === id)[0];

    try {
      const userId = [user_id];
      await deleteUser(userId);
      if (signalRConnection && user && token) {
        console.info(`[WS - INVOKE]: RefreshStatus.`);
        signalRConnection.invoke('DisconnectUser', userFilter.user_id);
      }
      setSelected([])
      
      if(changePage === 1 && page !== 1){
        setPage(page -1);
      }
      if(changePage === -1 && page === 1 ){
        setPage(page -1);
      }
      listPartner()
      enqueueSnackbar('Parceiro Excluido com sucesso!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Não foi possivel excluir o Parceiro!', { variant: 'error' });
    }
  };

  const handleSuspendRow = async (id: string) => {
    const userFilter = tableData.filter((element)=> element.partner_id === id)[0]

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
      const partnerId = tableData.filter((value) => value.partner_id === id)[0];
      suspendUserId.Email = partnerId.email;
      suspendUserId.Fullname = partnerId.legal_name;
      suspendUserId.Phone = partnerId.phone_number;
      suspendUserId.Document = partnerId.document;
      suspendUserId.Avatar = partnerId.avatar;
      suspendUserId.Active = partnerId.active;
      suspendUserId.User_id = partnerId.user_id;
      activePartner = {
        partner_id: partnerId.partner_id,
        legal_name: partnerId.legal_name,
        fantasy_name: partnerId.fantasy_name,
        email: partnerId.email,
        phone_number: partnerId.phone_number,
        document: partnerId.document,
        branch: [
          {
            branch_id: partnerId.branch[0].branch_id,
            branch_name: partnerId.branch[0].branch_name,
            document: partnerId.branch[0].document,
            phone: "",
            partner_id: partnerId.branch[0].partner_id,
            updated_by: user?.user_id,
            address: {
              address_id: partnerId.branch[0]?.address?.address_id,
              street: partnerId.branch[0]?.address?.street,
              number: partnerId.branch[0]?.address?.number,
              complement: partnerId.branch[0]?.address?.complement,
              district: partnerId.branch[0]?.address?.district,
              city: partnerId.branch[0]?.address?.city,
              state: partnerId.branch[0]?.address?.state,
              zip_code: partnerId.branch[0]?.address?.zip_code,
              active: partnerId.branch[0]?.address?.active,
              latitude: partnerId.branch[0]?.address?.latitude,
              longitude: partnerId.branch[0]?.address?.longitude,
              updated_by: user?.user_id,
            },
          },
        ],
        active: true,
        user_id: partnerId.user_id,
        admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id,
        updated_by: user?.user_id,
      };

      suspendPartnerId.push(partnerId.partner_id);
      if (partnerId.active === false) {
        await updateUser({ ...suspendUserId, Active: true });
        await updatePartner(activePartner);
        enqueueSnackbar('Parceiro Ativado com sucesso!', { variant: 'success' });
      } else {
        suspendPartnerId.push(partnerId.partner_id);
        await updateUser({ ...suspendUserId, Active: false });
        await inactiveMassPartner(suspendPartnerId);

      if (signalRConnection && user && token) {
        console.info(`[WS - INVOKE]: RefreshStatus.`);
        signalRConnection.invoke('DisconnectUser', userFilter.user_id);
      }
        enqueueSnackbar('Parceiro Suspenso com sucesso!', { variant: 'success' });
      }
      listPartner();
    } catch {
      enqueueSnackbar('Não foi possivel Suspender o Parceiro!', { variant: 'error' });
    }
  };

  const handleDeleteRows = async (ids: string[]) => {
    const changePages = 5 * page  -  (totalRows - ids.length + 1);
    const collaboratorFilter: IPartner[] = tableData.filter((element)=>  ids.includes(element.partner_id))
    
    try {
      const deleteUserId: string[] = [];
      const deletePartnerId: string[] = [];
      selected.forEach((id) => {
        const partnerId = tableData.filter((value) => value.partner_id === id)[0];
        deleteUserId.push(partnerId.user_id);
        deletePartnerId.push(partnerId.partner_id);
      });
      await deleteUser(deleteUserId);
      collaboratorFilter.forEach((item: IPartner) => {
        if (signalRConnection && user && token) {
          console.info(`[WS - INVOKE]: RefreshStatus.`);
          signalRConnection.invoke('DisconnectUser', item.user_id);
        }
      })
      setSelected([]);

      if(changePages === 1 && page !== 1){
        setPage(page -1)
      }
      if(changePages === -1 && page === 1 ){
        setPage(page -1)
      }
      listPartner()
      enqueueSnackbar('Parceiros Excluido com sucesso!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Não foi possivel excluir Parceiros!', { variant: 'error' });
    }
  };

  const handleSuspendRows = async (ids: string[]) => {
    const collaboratorFilter: IPartner[] = tableData.filter((element)=>  ids.includes(element.partner_id))
    try {
      const suspendUserId: iUpdateUser = {
        Email: '',
        Fullname: '',
        Phone: '',
        Document: '',
        User_id: '',
        Active: true,
        Avatar: null,
      };
      const suspendPartnerId: string[] = [];
      selected.forEach(async (id) => {
        const partnerId = tableData.filter((value) => value.partner_id === id)[0];
        suspendUserId.Email = partnerId.email;
        suspendUserId.Fullname = partnerId.legal_name;
        suspendUserId.Phone = partnerId.phone_number;
        suspendUserId.Document = partnerId.document;
        suspendUserId.Avatar = partnerId.avatar;
        suspendUserId.Active = partnerId.active;
        suspendUserId.User_id = partnerId.user_id;
        suspendUserId.Phone_verified = false;
        suspendPartnerId.push(partnerId.partner_id);
        await updateUser({ ...suspendUserId, Active: false });
        listPartner();
      });
      setSelected([]);
      await inactiveMassPartner(suspendPartnerId);
      collaboratorFilter.forEach((item: IPartner) => {
        if (signalRConnection && user && token) {
          console.info(`[WS - INVOKE]: RefreshStatus.`);
          signalRConnection.invoke('DisconnectUser', item.user_id);
        }
      })
      enqueueSnackbar('Parceiros Suspensos com sucesso!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Não foi possivel Suspender Parceiros!', { variant: 'error' });
    }
  };

  const handleEditRow = (user_id: string) => {
    push(PATH_DASHBOARD.partner.edit(user_id));
  };

  const handleManagementRow = (user_id: string) => {
    push(PATH_DASHBOARD.partner.managementPartner(user_id));
  };

  const handleResetFilter = () => {
    setFilter('');
    setFilterRole('all');
    setFilterStatus('Todos');
  };

  async function listPartner() {
    setIsLoading(true);
    try {
      const list = await getPartnerList({ itensPerPage: rowsPerPage, page, filter });
      const sortedPartners = list.partners.sort((x: IPartner, y: IPartner) => {
        const dateX = new Date(x.identifier).getTime();
        const dateY = new Date(y.identifier).getTime();
        return dateX - dateY;
      });
      setTableData(sortedPartners);
      setTotalRows(list.pagination.totalRows)
      if (list.partners.length === 0) {
        setIsNotFound(true);
      } else {
        setIsNotFound(false);
      }
    } catch (error) {
      setIsNotFound(true);
      console.error('Erro na requisição:', error);
    }
    setIsLoading(false);
  }


  useEffect(() => {
    listPartner();
  }, [filter]);

  useEffect(() => {
    listPartner();
  }, [page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>Administrador | Lista de Parceiros</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Lista de Parceiros"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Parceiros', href: PATH_DASHBOARD.partner.list },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.partner.registerPartner}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Novo Parceiro
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <PartnerTableToolbar
            isFiltered={isFiltered}
            filterName={filter}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.partner_id)
                )
              }
              action={[
                <Tooltip title="Deletar">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>,
                <Tooltip title="Suspender">
                  <IconButton color="primary" onClick={handleOpenConfirmSuspend}>
                    <Iconify icon="eva:slash-outline" />
                  </IconButton>
                </Tooltip>,
              ]}
            />

            <Scrollbar>
              <Table size="medium" sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.partner_id)
                    )
                  }
                />
                {isLoading ? (
                   <div style={{ display: 'flex', width: '1250%',  alignItems: 'center', justifyContent: 'center', margin: '40px 0px' }}>
                   <Icon icon="eos-icons:bubble-loading" width="90" height="90" />
                 </div>
               ) : (
                  <TableBody>
                    {isNotFound === false && tableData
                      .map((row) => (
                        <PartnerTableRow
                          key={row.partner_id}
                          row={row}
                          selected={selected.includes(row.partner_id)}
                          onSelectRow={() => onSelectRow(row.partner_id)}
                          onDeleteRow={() => handleDeleteRow(row.partner_id, row.user_id)}
                          onSuspendRow={() => handleSuspendRow(row.partner_id)}
                          onEditRow={() => handleEditRow(row.user_id)}
                          onManagementRow={() => handleManagementRow(row?.user_id)}
                          onHandleOpenChatWithPartner={() =>handleOpenChatWithPartner(row?.user_id)}
                        />
                      ))}
                    <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            labelRowsPerPage="Linhas por Página"
            rowsPerPageOptions={[5, 10, 25]}
            count={totalRows}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Deletar"
        content={
          <>
            Tem certeza de que deseja realizar a exclusão?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Deletar
          </Button>
        }
      />
      <ConfirmDialog
        open={openConfirmSuspend}
        onClose={handleCloseConfirmSuspend}
        title="Suspender"
        content={
          <>
            Tem certeza de que deseja realizar a suspensão?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleSuspendRows(selected);
              handleCloseConfirmSuspend();
            }}
          >
            Suspender
          </Button>
        }
      />
    </>
  );
}
