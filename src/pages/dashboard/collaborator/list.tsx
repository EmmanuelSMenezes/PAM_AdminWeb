import { Icon } from '@iconify/react';
import {
  Button, Card, Container,
  IconButton, Table, TableBody, TableContainer, Tooltip
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { ICollaborator, ICollaboratorListResponse } from 'src/@types/collaborator';
import { collaboratorDelete, collaboratorList, collaboratorUpdate } from 'src/service/collaborator';
import { useAuthContext } from '../../../auth/useAuthContext';
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
import CollaboratorTableRow from '../../../sections/@dashboard/user/list/CollaboratorTableRow';
import CollaboratorTableToolbar from '../../../sections/@dashboard/user/list/CollaboratorTableToolbar';


const TABLE_HEAD = [
  { id: '' },
  { id: 'fullname', label: 'Nome/Razão Social', align: 'left' },
  { id: 'document', label: 'CPF/CNPJ', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

export interface IPaginations {
  totalRows: number;
  totalPages: number;
}

export interface ISelectedCollaborator { 
  active: boolean;
  collaborator_id: string;
}


CollaboratorListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;


export default function CollaboratorListPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { user, signalRConnection, token } = useAuthContext();
  const [tableData, setTableData] = useState<ICollaborator[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [suspendConfirm, setSuspendConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [totalRows, setTotalRows] = useState(0)
  const [filter, setFilter] = useState('');


  const isFiltered = filter !== '';

  
  const handleSuspendConfirm = () => {
    setSuspendConfirm(true);
  };

  const handleSuspendClose = () => {
    setSuspendConfirm(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilter(event.target.value);
  };

  const changePage = 5 * page - totalRows;

  const handleDeleteRow = async (id: string) => {
    const userId = tableData.filter((element)=> element.collaborator_id === id)[0]
    const collaboratorSelected: string[] = [];
    collaboratorSelected.push(id)   
    try {
      await collaboratorDelete(collaboratorSelected)

      if (signalRConnection && user && token) {
        console.info(`[WS - INVOKE]: RefreshStatus.`);
        signalRConnection.invoke('DisconnectUser', userId.user_id);
      }

      enqueueSnackbar('Colaborador Deletado com sucesso!', { variant: 'success' });
      setSelected([]);
      if(changePage === 1 && page !== 1){
        setPage(page -1);
      }
      if(changePage === -1 && page === 1 ){
        setPage(page -1);
      } 
        listCollaborator();
    } catch (error) {
      enqueueSnackbar('Não foi possivel Deletar o Colaborador!', { variant: 'error' });
    }
  };

  const handleDeleteRows = async (id: string[]) => {
    const changePages = 5 * page  -  (totalRows - id.length + 1);
    const collaboratorFilter: ICollaborator[] = tableData.filter((element)=>  id.includes(element.collaborator_id));
    try {
      await collaboratorDelete(id)
      enqueueSnackbar('Colaboradores Deletados com sucesso!', { variant: 'success' });

      collaboratorFilter.forEach((item: ICollaborator) => {
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
      } else {
        listCollaborator();
      }
    } catch (error) {
      enqueueSnackbar('Não foi possivel Deletar os Colaboradores!', { variant: 'error' });
    }
  }

  const handleSuspendRow = async (id: string) => {
    const collaboratorSelected: ISelectedCollaborator[] = [];
    const userId = tableData.filter((element)=> element.collaborator_id === id)[0]
  
    if (id){
      collaboratorSelected.push({collaborator_id: id, active: false})
      
    } else {
      selected.forEach((item: string)=> {
        collaboratorSelected.push({collaborator_id: item, active: false})
      })
    }
    try {
      await collaboratorUpdate(collaboratorSelected);
      if (signalRConnection && user && token ) {
        console.info(`[WS - INVOKE]: RefreshStatus.`);
        signalRConnection.invoke('DisconnectUser', userId.user_id);
      }

      enqueueSnackbar('Colaborador Suspenso com sucesso!', { variant: 'success' });
      setSelected([]);
      listCollaborator();
    } catch {
      enqueueSnackbar('Não foi possivel Suspender o Colaborador!', { variant: 'error' });
    }
  };

  const handleSuspendRows = async (id: string[]) => {
    const collaboratorSelected: ISelectedCollaborator[] = [];
    const collaboratorFilter: ICollaborator[] = tableData.filter((element)=>  id.includes(element.collaborator_id))

    selected.forEach((item: string)=> {
      collaboratorSelected.push({collaborator_id: item, active: false})
    })

    try {
      await collaboratorUpdate(collaboratorSelected);
      collaboratorFilter.forEach((item: ICollaborator) => {
        if (signalRConnection && user && token) {
          console.info(`[WS - INVOKE]: RefreshStatus.`);
          signalRConnection.invoke('DisconnectUser', item.user_id);
        }
      })

      enqueueSnackbar('Colaboradores Suspensos com sucesso!', { variant: 'success' });
      setSelected([]);
      listCollaborator();
    } catch {
      enqueueSnackbar('Não foi possivel Suspender os Colaboradores!', { variant: 'error' });
    }
  };

  const handleActiveRow = async (id: string) => {
    const collaboratorSelected: ISelectedCollaborator[] = [];
    if (id){
      collaboratorSelected.push({collaborator_id: id, active: true})
    } else {
      selected.forEach((item: string)=> {
        collaboratorSelected.push({collaborator_id: item, active: true})
      })
    }

    try {
      await collaboratorUpdate(collaboratorSelected);
      enqueueSnackbar('Colaborador Ativo com sucesso!', { variant: 'success' });
      setSelected([]);
      listCollaborator();
    } catch {
      enqueueSnackbar('Não foi possivel Ativar o Colaborador!', { variant: 'error' });
    }
  };


  const handleResetFilter = () => {
    setFilter('');
  };

  async function listCollaborator() {
    setIsLoading(true);
    try {
      const list: ICollaboratorListResponse = await collaboratorList({sponsor_id: user?.isCollaborator ? user?.sponsor_id : user?.user_id, itensPerPage: rowsPerPage, page, filter});
      setTableData(list.collaborators);
      setTotalRows(list.pagination.totalRows)
      setIsLoading(false);
      if (list.collaborators.length === 0) {
        setIsNotFound(true);
      } else {
        setIsNotFound(false);
      }
    } catch (error) {
      setIsNotFound(true);
      console.error('Erro na requisição:', error);
    }
  };


  useEffect(() => {
    listCollaborator();
  }, [ filter]);

  useEffect(() => {
    listCollaborator();
  }, [page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>Administrador | Lista de Colaboradores</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Lista de Colaboradores"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Colaboradores', href: PATH_DASHBOARD.partner.list },
          ]}
          action={
            !user?.isCollaborator &&
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.collaborator.createCollaborator}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Novo Colaborador
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <CollaboratorTableToolbar
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
                  tableData.map((row) => row.collaborator_id)
                )
              }
              action={[
                !user?.isActiveCollaborator &&
                <Tooltip title="Deletar">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>,
                !user?.isActiveCollaborator &&
                <Tooltip title="Suspender">
                <IconButton color="primary" onClick={handleSuspendConfirm}>
                  <Iconify icon="eva:slash-outline" />
                </IconButton>
              </Tooltip>
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
                />
              {isLoading ? (
                <div style={{ display: 'flex', width: '1250%',  alignItems: 'center', justifyContent: 'center', margin: '40px 0px' }}>
                  <Icon icon="eos-icons:bubble-loading" width="90" height="90" />
                 </div>
               ) : (
                  <TableBody>
                    {tableData.map((row) => (
                      <CollaboratorTableRow
                        key={row.collaborator_id}
                        row={row}
                        selected={selected.includes(row.collaborator_id)}
                        onSelectRow={() => onSelectRow(row.collaborator_id)}
                        onSuspendRow={() => handleSuspendRow(row.collaborator_id)}
                        onActiveRow={() => handleActiveRow(row.collaborator_id)}
                        onDeleteRow={() => handleDeleteRow(row.collaborator_id)}
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
            Tem certeza de que deseja excluir <strong> {selected.length} </strong> {selected.length > 1 ? 'colaboradores' : 'colaborador' }?
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
        open={suspendConfirm}
        onClose={handleSuspendClose}
        title="Suspender"
        content={
          <>
            Tem certeza de que deseja suspender <strong> {selected.length} </strong> {selected.length > 1 ? 'colaboradores' : 'colaborador' }?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleSuspendRows(selected);
              handleSuspendClose();
            }}
          >
            Suspender
          </Button>
        }
      />
    </>
  );
}
