import { Icon } from '@iconify/react';
import {
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IProductResponse, iUpdateProduct } from 'src/@types/productService';
import ProductServiceTableRow from 'src/sections/@dashboard/user/list/ProductServiceTableRow';
import ProductServiceTableToolbar from 'src/sections/@dashboard/user/list/ProductServiceTableToolbar';
import { getproductService, putProductService } from 'src/service/productService';
import { useAuthContext } from '../../../auth/useAuthContext';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
import {
  emptyRows, TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction, useTable
} from '../../../components/table';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';

const TABLE_HEAD = [
  { id: '', align: 'left' },
  { id: 'name', label: 'Nome', align: 'left' },
  { id: 'price', label: 'Preço', align: 'left' },
  { id: 'id', label: 'ID', align: 'center' },
  { id: '' },
];

UserListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function UserListPage() {
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
    onSelectAllRows,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { push } = useRouter();
  const { user, signalRConnection } = useAuthContext();
  const [tableData, setTableData] = useState<IProductResponse[]>([]);
  const [filter, setFilter] = useState('');
  const [totalRows, setTotalRows] = useState(0);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [isNotFound, setIsNotFound] = useState(false);


  const isFiltered = filter !== '';

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

  const handleDeleteRow = async (id: string) => {
  };

  const changePage = 5 * page - totalRows;
  const handleSuspendRow = async (id: string) => {
    try {
      const suspendProductId: iUpdateProduct = {
        product_id: '',
        name: '',
        description: '',
        category: [
          {
            category_id: '',
            category_parent_id: '',
          },
        ],
        minimum_price: 0,
        note: '',
        type: '',
        active: true,
        updated_by: user?.user_id,
      };
      const productId = tableData.filter((value) => value.product_id === id)[0];
      suspendProductId.product_id = productId.product_id;
      suspendProductId.name = productId.name;
      suspendProductId.description = productId.description;
      suspendProductId.note = productId.note;
      suspendProductId.minimum_price = productId.minimum_price;
      suspendProductId.category[0].category_id = productId.categories[0]?.category_id;
      suspendProductId.category[0].category_parent_id = productId.categories[0]?.category_parent_id;
      suspendProductId.active = productId.active;
      suspendProductId.type = productId.type;
      await putProductService({ ...suspendProductId, active: false });
      if(changePage === 1 && page !== 1){
        setPage(page -1);
      }
      if(changePage === -1 && page === 1 ){
        setPage(page -1);
      } 
      signalRConnection?.invoke('RefreshProductListOnPartner');
      listProduct();
      enqueueSnackbar('Exclusão realizada com sucesso!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Não foi possivel foi possível realizar a exclusão.', { variant: 'error' });
    }
  };

  const handleSuspendRows = async (ids: string[]) => {
    const changePages = 5 * page  -  (totalRows - ids.length + 1);
    try {
      const suspendProductId: iUpdateProduct = {
        product_id: '',
        name: '',
        description: '',
        category: [
          {
            category_id: '',
            category_parent_id: '',
          },
        ],
        minimum_price: 0,
        note: '',
        type: '',
        active: true,
        updated_by: user?.user_id,
      };
      selected.forEach(async (id) => {
        const productId = tableData.filter((value) => value.product_id === id)[0];
        suspendProductId.product_id = productId.product_id;
        suspendProductId.name = productId.name;
        suspendProductId.description = productId.description;
        suspendProductId.note = productId.note;
        suspendProductId.minimum_price = productId.minimum_price;
        suspendProductId.category[0].category_id = productId.categories[0]?.category_id;
        suspendProductId.category[0].category_parent_id =
          productId.categories[0]?.category_parent_id;
        suspendProductId.active = productId.active;
        suspendProductId.type = productId.type;
        await putProductService({ ...suspendProductId, active: false });
        signalRConnection?.invoke('RefreshProductListOnPartner');
        if(changePages === 1 && page !== 1){
          setPage(page -1)
        }
        if(changePages === -1 && page === 1 ){
          setPage(page -1)
        } else {
          listProduct()
        }
      });
      setSelected([]);
      enqueueSnackbar('Exclusão realizada com sucesso!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Não foi possivel foi possível realizar a exclusão', { variant: 'error' });
    }
  };

  const handleEditRow = (product_id: string) => {
    push(PATH_DASHBOARD.productService.edit(product_id));
  };

  const handleManagementRow = (product_id: string) => {
    push(PATH_DASHBOARD.productService.management(product_id));
  };

  const handleResetFilter = () => {
    setFilter('');
  };

  async function listProduct() {
    setIsLoading(true);
    try {
      const list = await getproductService({ itensPerPage: rowsPerPage, page, filter });
      setTableData(list.products);
      setTotalRows(list.pagination.totalRows);
      if (list.pagination.totalRows === 0) {
        setIsNotFound(true);
      } else {
        setIsNotFound(false);
      }
    } catch (error) {
      setIsNotFound(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    listProduct();
  }, [filter]);

  useEffect(() => {
    listProduct();
  }, [page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>Administrador | Produtos e Serviços</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Produtos e Serviços"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Produtos e Serviços', href: PATH_DASHBOARD.productService.list },
          ]}
          action={
            <Container sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Button
                component={NextLink}
                href={PATH_DASHBOARD.productService.createItem}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Cadastrar
              </Button>
            </Container>
          }
        />

        <Card sx={{ p: 3 }}>
          <ProductServiceTableToolbar
            isFiltered={isFiltered}
            filterName={filter}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />
          <Divider />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.product_id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
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
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.product_id)
                    )
                  }
                />

              {isLoading ? (
                <div style={{ display: 'flex', width: '1250%',  alignItems: 'center', justifyContent: 'center', margin: '40px 0px' }}>
                  <Icon icon="eos-icons:bubble-loading" width="90" height="90" />
                 </div>
               ) : (
                  <TableBody>
                    {tableData.map((row) => (
                      <ProductServiceTableRow
                        key={row.product_id}
                        row={row}
                        selected={selected.includes(row.product_id)}
                        onSelectRow={() => onSelectRow(row.product_id)}
                        onDeleteRow={() => handleDeleteRow(row.product_id)}
                        onSuspendRow={() => handleSuspendRow(row.product_id)}
                        onEditRow={() => handleEditRow(row.product_id)}
                        onManagementRow={() => handleManagementRow(row.product_id)}
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
        title="Delete"
        content={
          <>
            Tem certeza de que deseja excluir?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleSuspendRows(selected);
              handleCloseConfirm();
            }}
          >
            Deletar
          </Button>
        }
      />
    </>
  );
}