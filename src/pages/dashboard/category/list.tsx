import { Icon } from '@iconify/react';
import {
  Button, Card, Container,
  IconButton, Table, TableBody, TableContainer, Tooltip
} from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ICategoryResponse, IUpdateCategory } from 'src/@types/category';
import { getCategory, putCategory } from 'src/service/productService';
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
import CategoryTableRow from '../../../sections/@dashboard/user/list/CategoryTableRow';
import CategoryTableToolbar from '../../../sections/@dashboard/user/list/CategoryTableToolbar';


const TABLE_HEAD = [
  { id: 'description', label: 'Nome', align: 'left' },
  { id: 'categoria', label: 'Categoria', align: 'left' },
  { id: 'id', label: 'ID', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: '' },
];

CategoryListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function CategoryListPage() {
  const {
    page,
    setPage,
    order,
    orderBy,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const { push } = useRouter();
  const [tableData, setTableData] = useState<ICategoryResponse[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0)
  const { enqueueSnackbar } = useSnackbar();
  const [isNotFound, setIsNotFound] = useState(false);
  const [filter, setFilter] = useState('');

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

  const handleSuspendRow = async (id: string) => {
    try {
      const suspendCategoryId: IUpdateCategory = {
        category_id: '',
        description: '',
        category_parent_id: '',
        active: true,
        updated_by: user?.user_id,
      };
      const categoryId = tableData.filter((value) => value.category_id === id)[0];
      suspendCategoryId.category_id = categoryId?.category_id;
      suspendCategoryId.description = categoryId?.description;
      suspendCategoryId.category_parent_id = categoryId.category_parent_id;

      await putCategory({ ...suspendCategoryId, active: false });
      listCategory();
      enqueueSnackbar('Categoria suspensa com sucesso!', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(`${error.message}.`, { variant: 'error' });
    }
  };

  const handleActiveRow = async (id: string) => {
    try {
      const activeCategoryId: IUpdateCategory = {
        category_id: '',
        description: '',
        category_parent_id: '',
        active: true,
        updated_by: user?.user_id,
      };
      const categoryId = tableData.filter((value) => value.category_id === id)[0];
      activeCategoryId.category_id = categoryId?.category_id;
      activeCategoryId.description = categoryId?.description;
      activeCategoryId.category_parent_id = categoryId.category_parent_id;

      await putCategory({ ...activeCategoryId, active: true });
      listCategory();
      enqueueSnackbar('Categoria Ativada com sucesso!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Não foi possivel Ativar a Categoria!', { variant: 'error' });
    }
  };

  const handleSuspendRows = async (ids: string[]) => {
    try {
      const suspendCategoryId: IUpdateCategory = {
        category_id: '',
        description: '',
        category_parent_id: '',
        active: true,
        updated_by: user?.user_id,
      };
      selected.forEach(async (id) => {
        const categoryId = tableData.filter((value) => value.category_id === id)[0];
        suspendCategoryId.category_id = categoryId.category_id;
        suspendCategoryId.description = categoryId.description;
        suspendCategoryId.category_parent_id = categoryId.category_parent_id;
        suspendCategoryId.active = categoryId.active;
        await putCategory({ ...suspendCategoryId, active: false });
        listCategory()
      });
      setSelected([]); 
      enqueueSnackbar('Categorias Suspensas com sucesso!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Não foi possivel Suspender as Categorias!', { variant: 'error' });
    }
  };

  const handleEditRow = (category_id: string) => {
    push(PATH_DASHBOARD.category.edit(category_id));
  };

  const handleResetFilter = () => {
    setFilter('');
  };

  async function listCategory() {
    setIsLoading(true);
    try {
      const list = await getCategory({ itensPerPage: rowsPerPage, page, filter });
      setTableData(list.categories)
      setTotalRows(list.paginations.totalRows)
      if (list.categories.length === 0) {
        setIsNotFound(true);
      } else {
        setIsNotFound(false);
      }
    } catch (error) {
      setIsNotFound(true);
      console.error('Erro na requisição:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    listCategory();
  }, [filter]);

  useEffect(() => {
    listCategory();
  }, [page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>Administrador | Lista de Categorias</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Lista de Categorias"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Categorias', href: PATH_DASHBOARD.partner.list },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.category.createCategory}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Cadastrar
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <CategoryTableToolbar
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
                  tableData.map((row) => row.category_id)
                )
              }
              action={[
                <Tooltip title="Suspender">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
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
                      tableData.map((row) => row.category_id)
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
                      <CategoryTableRow
                        key={row.category_id}
                        row={row}
                        selected={selected.includes(row.category_id)}
                        onSelectRow={() => onSelectRow(row.category_id)}
                        onSuspendRow={() => handleSuspendRow(row.category_id)}
                        onActiveRow={() => handleActiveRow(row.category_id)}
                        onEditRow={() => handleEditRow(row.category_id)}
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
        title="Suspender"
        content={
          <>
            Tem certeza de que deseja suspender <strong> {selected.length} </strong> itens?
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
            Suspender
          </Button>
        }
      />
    </>
  );
}