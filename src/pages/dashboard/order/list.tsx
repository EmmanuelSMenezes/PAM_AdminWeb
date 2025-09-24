import { Icon } from '@iconify/react';
import {
  Card, Container, Divider, Table, TableBody, TableContainer
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IOrderResponse } from 'src/@types/order';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useSnackbar } from 'src/components/snackbar';
import OrderTableRow from 'src/sections/@dashboard/user/list/OrderTableRow';
import OrderTableToolbar from 'src/sections/@dashboard/user/list/OrderTableToolbar';
import { orderGet } from 'src/service/order';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import {
  emptyRows, TableEmptyRows,
  TableHeadCustom, TableNoData, TablePaginationCustom, useTable
} from '../../../components/table';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

const TABLE_HEAD = [
  { id: 'numberOrder', label: 'N° do Pedido', align: 'left' },
  { id: 'creationDate', label: 'Data de criação', align: 'center' },
  { id: 'fantasy_name_partner', label: 'Parceiro', align: 'center' },
  { id: 'fantasy_name_consumer', label: 'Consumidor', align: 'center' },
  { id: 'valueOrder', label: 'Valor do pedido', align: 'left' },
  { id: 'statusOrder', label: 'Status do pedido', align: 'center' },
];

OrderListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function OrderListPage() {
  const {
    page,
    order,
    orderBy,
    onChangePage,
    onChangeRowsPerPage,
    rowsPerPage,
    selected,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { push } = useRouter();
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [tableData, setTableData] = useState<IOrderResponse[]>([]);
  const [filterOrder, setFilterOrder] = useState('');
  const [filterPartner, setFilterPartner] = useState('');
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);
  const [filterConsumer, setFilterConsumer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [isNotFound, setIsNotFound] = useState(false);
  const [filterOrderStatus, setFilterOrderStatus] = useState('');
  const [filterSearch, setFilterSearch] = useState(false);

  
 const handleFilterSearch = () => {
  setFilterSearch(true)
 }

  const handleFilterPartner = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterPartner(event.target.value);
  };
  
  const handleFilterOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOrder(event.target.value);
  };

  const handleFilterConsumer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterConsumer(event.target.value);
  };

  const handleFilterOrderStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOrderStatus(event.target.value);
  };

  const handleFilterStartDate = (date: Date) => {
    setFilterStartDate(date);
  }

  const handleFilterEndDate = (date: Date) => {
    setFilterEndDate(date);
  }

  const handleManagementRow = (order_id: string) => {
    push(PATH_DASHBOARD.order.details(order_id));
  };

  const handleResetFilter = () => {
    setFilterPartner('');
    setFilterConsumer('');
    setFilterOrderStatus('');
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilterSearch(true);
    setFilterOrder('');
  };
  
  async function listOrder() {
    setIsLoading(true);
    let endDate : string = '';
    if(filterEndDate !== null){
      const newDates = new Date(filterEndDate);
      endDate = (`${newDates.getFullYear()  }-${  newDates.getMonth() + 1  }-${  newDates.getDate()}`) ;    
    }

    let startDate : string = '';
    if(filterStartDate !== null){
      const newDates = new Date(filterStartDate);
      startDate = (`${newDates.getFullYear()  }-${  newDates.getMonth() + 1  }-${  newDates.getDate()}`) ;    
    }
    try {
      const list = await orderGet({admin_id: user?.isCollaborator ? user?.sponsor_id : user?.admin_id, 
        status: filterOrderStatus, consumer: filterConsumer, partner: filterPartner, page, itensPerPage: rowsPerPage, 
        start_date: startDate === null ? '' : startDate, end_date: endDate === null ? '' : endDate, order_number: filterOrder});

      const sortedOrders = list.orders.sort((x: IOrderResponse, y: IOrderResponse) => {
        const dateX = new Date(x.created_at).getTime();
        const dateY = new Date(y.created_at).getTime();
        return dateY - dateX;
      });
      setTableData(sortedOrders);
      setTotalRows(list.pagination.totalRows)

      if (list.pagination.totalRows === 0) {
        setIsNotFound(true);
      } else {
        setIsNotFound(false);
      }
    } catch (error) {
      setIsNotFound(true);
    }
    setIsLoading(false);
    setFilterSearch(false);
  }
  
  useEffect(() => {
    if (filterStartDate !== null && filterEndDate === null) {
      enqueueSnackbar(
        'Não foi possivel realizar o filtro. É necessário preencher a Data Final!',
        { variant: 'error' }
      );
    } else {
      listOrder();
    }
  }, [filterSearch]);


  useEffect(() => {
    listOrder();
  }, [page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>Administrador | Pedidos</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Pedidos"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Pedidos', href: PATH_DASHBOARD.order.list },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <OrderTableToolbar
            filterOrder={filterOrder}
            filterName={filterPartner}
            filterConsumer={filterConsumer}
            filterOrderStatus={filterOrderStatus}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            onFilterConsumer={handleFilterConsumer}
            onFilterName={handleFilterPartner}
            onFilterOrder={handleFilterOrder}
            onFilterOrderStatus={handleFilterOrderStatus}
            onFilterStartDate={handleFilterStartDate}
            onFilterEndDate={handleFilterEndDate}
            onResetFilter={handleResetFilter}
            onSearchFilter={handleFilterSearch}
          />
          <Divider />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size="medium" sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData?.length}
                  numSelected={selected.length}
                />

              {isLoading ? (
                <div style={{ display: 'flex', width: '600%',  alignItems: 'center', justifyContent: 'center', margin: '40px 0px' }}>
                  <Icon icon="eos-icons:bubble-loading" width="90" height="90" />
                </div>
               ) : (
                  <TableBody>
                    {!isNotFound && tableData?.map((row: IOrderResponse) => (
                      <OrderTableRow
                        key={row.order_id}
                        row={row}
                        selected={selected.includes(row.order_id)}
                        onManagementRow={() => handleManagementRow(row.order_id)}
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
    </>
  );
}