import { Icon } from '@iconify/react';
import { Button, Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { IPayment, IPaymentListResponse, Pagination } from 'src/@types/billing';
import { paymentGet, paymentUpdate } from 'src/service/billing';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  useTable,
} from '../../../components/table';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';
import PaymentMethodsTableRow from '../../../sections/@dashboard/user/list/PaymentMethodsTableRow';
import PaymentMethodsTableToolbar from '../../../sections/@dashboard/user/list/PaymentMethodsTableToolbar';

const TABLE_HEAD = [
  { id: 'fullname', label: 'Meio de Pagamento', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'payment', label: 'Tipo de Pagamento', align: 'center' },
  { id: '' },
];

export interface ISelectedPayment {
  active: boolean;
  payment_options_id: string;
}

PaymentMethodsListPage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function PaymentMethodsListPage() {
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
  const [tableData, setTableData] = useState<IPayment[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  // const [suspendConfirm, setSuspendConfirm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filter, setFilter] = useState({
    itensPerPage: 10,
    page: 0,
    filter: '',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    filterName,
  });

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'Todos';

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSuspendRow = async (id: string) => {
    try {
      await paymentUpdate({ payment_options_id: id, active: false });
      enqueueSnackbar('Meio de Pagamento Suspenso com sucesso!', { variant: 'success' });
      setSelected([]);
      listPaymentMethods();
    } catch {
      enqueueSnackbar('Não foi possivel Suspender o Meio de Pagamento!', { variant: 'error' });
    }
  };

  // const handleSuspendClose = () => {
  //   setSuspendConfirm(false);
  // };
  // const handleSuspendRows = async (id: string[]) => {
  //   const methodsPaymentSelected: any= [];
  //   selected.forEach((item: string)=> {
  //     methodsPaymentSelected.push({payment_options_id: item, active: false})
  //   })
  //   console.log(methodsPaymentSelected)
  //   try {
  //     await paymentUpdate(methodsPaymentSelected);
  //     enqueueSnackbar('Meios de Pagamentos Suspensos com sucesso!', { variant: 'success' });
  //     setSelected([]);
  //     listPaymentMethods();
  //   } catch {
  //     enqueueSnackbar('Não foi possivel Suspender os Meios de Pagamentos!', { variant: 'error' });
  //   }
  // };

  const handleActiveRow = async (id: string) => {
    try {
      await paymentUpdate({ payment_options_id: id, active: true });
      enqueueSnackbar('Meio de Pagamento Ativo com sucesso!', { variant: 'success' });
      setSelected([]);
      listPaymentMethods();
    } catch {
      enqueueSnackbar('Não foi possivel Ativar o Meio de Pagamento!', { variant: 'error' });
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

  const listPaymentMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const list: IPaymentListResponse = await paymentGet({ ...filter });
      setTableData(list?.payments);
      setPagination(list.pagination);
      setIsLoading(false);
      if (list?.payments?.length === 0) {
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
    (!dataFiltered?.length && !!filterName) ||
    (!dataFiltered?.length && !!filterRole) ||
    (!dataFiltered?.length && !!filterStatus);

  useEffect(() => {
    listPaymentMethods();
  }, [listPaymentMethods]);

  const FooterTable = useCallback(
    () => (
      <TablePaginationCustom
        labelRowsPerPage="Linhas por Página"
        rowsPerPageOptions={[5, 10, 25]}
        count={pagination?.totalRows ? pagination?.totalRows : 0}
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
        <title>Administrador | Lista de Meios de Pagamento</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Meios de Pagamento"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Meios de Pagamento', href: PATH_DASHBOARD.paymentMethods.list },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.paymentMethods.createPaymentMethods}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Novo Meio de Pagamento
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <PaymentMethodsTableToolbar
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
                  tableData.map((row) => row?.payment_options_id)
                )
              }
              // action={[
              //   <Tooltip title="Suspender">
              //   <IconButton color="primary" onClick={handleSuspendConfirm}>
              //     <Iconify icon="eva:slash-outline" />
              //   </IconButton>
              // </Tooltip>
              // ]}
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
                  <div
                    style={{
                      display: 'flex',
                      width: '1250%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '40px 0px',
                    }}
                  >
                    <Icon icon="eos-icons:bubble-loading" width="90" height="90" />
                  </div>
                ) : (
                  <TableBody>
                    {dataFiltered?.map((row) => (
                      <PaymentMethodsTableRow
                        key={row?.payment_options_id}
                        row={row}
                        selected={selected.includes(row.payment_options_id)}
                        onSelectRow={() => onSelectRow(row.payment_options_id)}
                        onSuspendRow={() => handleSuspendRow(row.payment_options_id)}
                        onActiveRow={() => handleActiveRow(row.payment_options_id)}
                      />
                    ))}

                    <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData?.length)} />

                    <TableNoData isNotFound={isNotFound || isNotFounded} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </TableContainer>
          {pagination && <FooterTable />}
        </Card>
      </Container>

      {/* <ConfirmDialog
        open={suspendConfirm}
        onClose={handleSuspendClose}
        title="Suspender"
        content={
          <>
            Tem certeza de que deseja suspender <strong> {selected.length} </strong> {selected.length > 1 ? 'meios de pagamento' : 'meio de pagamento' }?
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
      /> */}
    </>
  );
}

function applyFilter({ inputData, filterName }: { inputData: IPayment[]; filterName: string }) {
  if (filterName) {
    inputData = inputData.filter(
      (payment) => payment.description.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  return inputData;
}
