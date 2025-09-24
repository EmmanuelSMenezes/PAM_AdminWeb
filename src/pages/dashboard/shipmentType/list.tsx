import { Icon } from '@iconify/react';
import {
  Button, Card, Container, Table, TableBody, TableContainer
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { IDeliveryOption, Pagination } from 'src/@types/billing';
import { deliveryGet, deliveryUpdate } from 'src/service/billing';
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
import ShipmentTypeTableRow from '../../../sections/@dashboard/user/list/ShipmentTypeTableRow';
import ShipmentTypeTableToolbar from '../../../sections/@dashboard/user/list/ShipmentTypeTableToolbar';


const TABLE_HEAD = [
  { id: 'fullname', label: 'Tipo de Frete', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

ShipmentTypeListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;


export default function ShipmentTypeListPage() {
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
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const [tableData, setTableData] = useState<IDeliveryOption[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [suspendConfirm, setSuspendConfirm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filter, setFilter] = useState({
    itensPerPage: 10,
    page: 0,
    filter: ''
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    filterName,
  });

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'Todos';

  const handleSuspendClose = () => {
    setSuspendConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const handleSuspendRow = async (id: string) => {
    try {
      await deliveryUpdate({delivery_options_id: id, active: false});;
      enqueueSnackbar('Frete Suspenso com sucesso!', { variant: 'success' });
      setSelected([]);
      listShipmentType();
    } catch {
      enqueueSnackbar('Não foi possivel Suspender o Frete!', { variant: 'error' });
    }
  };

  const handleActiveRow = async (id: string) => {  
    try {
      await deliveryUpdate({delivery_options_id: id, active: true});
      enqueueSnackbar('Frete Ativo com sucesso!', { variant: 'success' });
      setSelected([]);
      listShipmentType();
    } catch {
      enqueueSnackbar('Não foi possivel Ativar o Frete!', { variant: 'error' });
    }
  };

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilter({ ...filter, page: 0, itensPerPage: Number(event.target.value) });
    },
    [setFilter, filter]
  );

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('Todos');
  };

  const listShipmentType = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await deliveryGet({...filter});
      setTableData(list?.delivery_options);
      setPagination(list.pagination)
      setIsLoading(false);
      if (list.pagination.totalRows === 0) {
        setIsNotFound(true);
      } else {
        setIsNotFound(false);
      }
    } catch (error) {
      setIsNotFound(true);
      console.log('Erro na requisição:', error);
    }
  }, [filter]);

  const isNotFounded =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  useEffect(() => {
    listShipmentType();
  }, [listShipmentType]);

  const FooterTable = useCallback(
    () => (
      <TablePaginationCustom
        labelRowsPerPage="Linhas por Página"
        rowsPerPageOptions={[5, 10, 25]}
        count={pagination?.totalRows ? pagination.totalRows : 0}
        page={filter.page}
        rowsPerPage={filter.itensPerPage}
        onPageChange={(e, newPage) => {
          setFilter({ ...filter, page: newPage });
        }}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    ),
    [pagination, filter, handleChangeRowsPerPage]
  );

  return (
    <>
      <Head>
        <title>Administrador | Lista de Colaboradores</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Tipos de Frete"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Tipos de Fretes', href: PATH_DASHBOARD.shipmentType.list },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.shipmentType.createShipmentType}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Novo Tipo de Frete
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <ShipmentTypeTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
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
                  tableData.map((row) => row.delivery_option_id)
                )
              }
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
                    {dataFiltered.map((row) => (
                      <ShipmentTypeTableRow
                        key={row.delivery_option_id}
                        row={row}
                        selected={selected.includes(row.delivery_option_id)}
                        onSelectRow={() => onSelectRow(row.delivery_option_id)}
                        onSuspendRow={() => handleSuspendRow(row.delivery_option_id)}
                        onActiveRow={() => handleActiveRow(row.delivery_option_id)}
                      />
                    ))}

                    <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                    <TableNoData isNotFound={isNotFound || isNotFounded} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </TableContainer>
          {pagination && <FooterTable />}
        </Card>
      </Container>
      <ConfirmDialog
        open={suspendConfirm}
        onClose={handleSuspendClose}
        title="Suspender"
        content={
          <>
            Tem certeza de que deseja suspender <strong> {selected.length} </strong> {selected.length > 1 ? 'tipos de frete' : 'tipo de frete' }?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
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

function applyFilter({
  inputData,
  filterName,
}: {
  inputData: IDeliveryOption[];
  filterName: string;
}) {
  if (filterName) {
    inputData = inputData.filter(
      (delivery) =>
        delivery.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}