import { TableRow, TableCell, TableRowProps, Skeleton } from '@mui/material';
import * as React from 'react';

interface iTableSkeleton extends TableRowProps {
  columns?: number;
  rows?: number;
}

export const LoadingTableLineSkeleton: React.FC<iTableSkeleton> = ({
  columns = 1,
  rows = 4,
  ...rest
}) => (
  <>
    {Array(rows)
      .fill((w: any) => w)
      .map((a, index) => `${index}`)
      .map((v) => (
        <TableRow key={v} {...rest}>
          {Array(columns)
            .fill((y: any) => y)
            .map((a, i) => `${i}`)
            .map((i) => (
              <TableCell key={i}>
                <Skeleton />
              </TableCell>
            ))}
        </TableRow>
      ))}
  </>
);
