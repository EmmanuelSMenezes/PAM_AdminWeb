import { Icon } from '@iconify/react';
import { Button, Card, Container, Tab, Table, TableBody, TableContainer, Tabs } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IReportResponse } from 'src/@types/report';
import Label from 'src/components/label';
// import { getReport } from 'src/service/report';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { useSettingsContext } from '../../../components/settings';
import { emptyRows, TableEmptyRows, TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from '../../../components/table';
import DashboardLayout from '../../../layouts/dashboard';
import { PATH_DASHBOARD } from '../../../routes/paths';
import ReportTableRow from '../../../sections/@dashboard/user/list/ReportTableRow';
import ReportTableToolbar from '../../../sections/@dashboard/user/list/ReportTableToolbar';


const TABLE_HEAD = [
  { id: 'id', label: 'Id', align: 'left' },
  { id: 'name', label: 'Nome', align: 'left' },
  { id: 'date', label: 'Data', align: 'left' },
  { id: '' },
];



ReportListPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export default function ReportListPage() {
  const {
    page,
    setPage,
    order,
    orderBy,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    selected,
    onSelectRow,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { push } = useRouter();
  const [tableData, setTableData] = useState<IReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0)
  const [isNotFound, setIsNotFound] = useState(false);
  const [filter, setFilter] = useState('');

  const isFiltered = filter !== '';

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilter(event.target.value);
  };

  const handleResetFilter = () => {
    setFilter('');
  };

  const handleManagementRow = (order_id: string) => {
    push(PATH_DASHBOARD.report.details(order_id));
  };

  const TABS = [
    { value: 'all', label: 'Relatórios', color: 'info', count: 5 },
    { value: 'paid', label: 'Enviados', color: 'success', count: 0 },
    {
      value: 'unpaid',
      label: 'Não Enviados',
      color: 'warning',
      count: 5,
    },
    // { value: 'overdue', label: 'Vencidos', color: 'error' },
    // { value: 'draft', label: 'Resumos', color: 'default' },
  ] as const;

  async function listReport() {
    setIsLoading(true);

    const relatorios =  {
      report: [
        { name: "Relatório 1", date: "2023-07-25", report_id: "njshwdfdbdrwhb" },
        { name: "Relatório 2", date: "2023-07-24", report_id: "njshdwffdbdhgb" },
        { name: "Relatório 3", date: "2023-07-23", report_id: "njshwadfdbfdhb" },
        { name: "Relatório 4", date: "2023-07-22", report_id: "njshdwfdfbkdhb" },
        { name: "Relatório 5", date: "2023-07-21", report_id: "njshdwdfddbdhb" },
        { name: "Relatório 6", date: "2023-07-20", report_id: "njshdsffydbdhb" },
        { name: "Relatório 7", date: "2023-07-19", report_id: "njshfedfudbdhb" },
        { name: "Relatório 8", date: "2023-07-18", report_id: "njshdfifdbddhb" },
        { name: "Relatório 9", date: "2023-07-17", report_id: "njsshdszffdbdhb" },
        { name: "Relatório 10", date: "2023-07-16", report_id: "njshdvsxffdbdhb" },
      ],
      paginations: {
        totalRows: 10,
        totalPages: 5
      }
    };
    try {
      // const list = await getReport({ itensPerPage: rowsPerPage, page, filter });
      setTableData(relatorios.report)
      setTotalRows(relatorios.paginations.totalRows)
      // if (list.categories.length === 0) {
      //   setIsNotFound(true);
      // } else {
      //   setIsNotFound(false);
      // }
    } catch (error) {
      setIsNotFound(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    listReport();
  }, [filter]);

  useEffect(() => {
    listReport();
  }, [page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>Administrador | Lista de Relatórios</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Lista de Relatórios"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Relatórios', href: PATH_DASHBOARD.partner.list },
          ]}
          action={
            <Button
              component={NextLink}
              href={PATH_DASHBOARD.report.createReport}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Cadastrar
            </Button>
          }
        />

        <Tabs
          value={() => console.log('oi')}
          onChange={() => console.log('oi')}
          sx={{
            px: 2,
            bgcolor: 'background.neutral',
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              icon={
                <Label color={tab.color} sx={{ mr: 1 }}>
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>


        <Card sx={{ p: 3 }}>
          <ReportTableToolbar
            isFiltered={isFiltered}
            filterName={filter}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

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
                      <ReportTableRow
                        key={row.report_id}
                        row={row}
                        selected={selected.includes(row.report_id)}
                        onSelectRow={() => onSelectRow(row.report_id)}
                        onManagementRow={() => handleManagementRow(row.report_id)}
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
            rowsPerPageOptions={[10]}
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