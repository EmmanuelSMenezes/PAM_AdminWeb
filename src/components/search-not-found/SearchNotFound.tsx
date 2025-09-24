import { Paper, PaperProps, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Paper
      sx={{
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" paragraph>
        Desculpe, nenhum resultado encontrado.
      </Typography>

      <Typography variant="body2">
        Nenhum resultado encontrado para &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Tente verificar erros de digitação ou usar palavras completas.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Por favor, insira palavras-chave.
    </Typography>
  );
}
