import { TableCell, TableRow } from '@mui/material';
import { IReportResponse } from 'src/@types/report';

type Props = {
  row: IReportResponse;
  selected: boolean;
  onSelectRow: VoidFunction;
  onManagementRow: VoidFunction;
};

export default function ReportTableRow({
  row,
  selected,
  onManagementRow,
  onSelectRow
}: Props) {


  return (
    <TableRow hover selected={selected}>
      <TableCell onClick={() => { onManagementRow()}} align="left">{row.report_id}</TableCell>
      <TableCell onClick={() => { onManagementRow()}} align="left">{row.name}</TableCell>
      <TableCell onClick={() => { onManagementRow()}} align="left">{row.date}</TableCell>
    </TableRow>
  );
}
