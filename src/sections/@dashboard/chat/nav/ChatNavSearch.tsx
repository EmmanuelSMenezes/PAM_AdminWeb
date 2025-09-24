import { ClickAwayListener, InputAdornment } from '@mui/material';
import { CustomTextField } from '../../../../components/custom-input';
import Iconify from '../../../../components/iconify';

type Props = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickAway: VoidFunction;
};

export default function ChatNavSearch({ value, onChange, onClickAway }: Props) {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <CustomTextField
        fullWidth
        size="small"
        value={value}
        onChange={onChange}
        placeholder="Buscar Chats..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );
}
