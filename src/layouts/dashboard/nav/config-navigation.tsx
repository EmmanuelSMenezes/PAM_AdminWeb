import SvgColor from '../../../components/svg-color';
import { PATH_DASHBOARD } from '../../../routes/paths';

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  {
    subheader: 'Geral',
    items: [{ title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard }],
  },

  {
    subheader: 'Gerenciamento',
    items: [
      {
        title: 'Parceiros',
        path: PATH_DASHBOARD.partner.list,
        icon: ICONS.user,
      },
      {
        title: 'Colaboradores',
        path: PATH_DASHBOARD.collaborator.list,
        icon: ICONS.banking,
      },
      {
        title: 'Produtos e Serviços',
        path: PATH_DASHBOARD.productService.list,
        icon: ICONS.ecommerce,
      },
      {
        title: 'Categorias ',
        path: PATH_DASHBOARD.category.list,
        icon: ICONS.menuItem,
      },
      // {
      //   title: 'Relatórios ',
      //   path: PATH_DASHBOARD.report.list,
      //   icon: ICONS.kanban
      // },
      {
        title: 'Tipos de Frete',
        path: PATH_DASHBOARD.shipmentType.list,
        icon: ICONS.dashboard,
      },
      {
        title: 'Meios de Pagamento',
        path: PATH_DASHBOARD.paymentMethods.list,
        icon: ICONS.invoice,
      },
      {
        title: 'Pedidos',
        path: PATH_DASHBOARD.order.list,
        icon: ICONS.cart,
      },
    ],
  },
  {
    subheader: 'Suporte',
    items: [
      {
        title: 'chat',
        path: PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
      },
    ],
  },
];

export default navConfig;
