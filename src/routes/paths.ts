// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_RESET_PASSWORD = '/reset-password';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_RESET_PASSWORD = {
  // root: path(ROOTS_RESET_PASSWORD, '/:userToken'),
  root: (userToken: string) => path(ROOTS_RESET_PASSWORD, `/${userToken}`),
  // resetPassword: path(ROOTS_RESET_PASSWORD, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_DASHBOARD, '/blank'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    file: path(ROOTS_DASHBOARD, '/file'),
    // category: path(ROOTS_DASHBOARD, '/category'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
  },
  partner: {
    root: path(ROOTS_DASHBOARD, '/partner/list'),
    list: path(ROOTS_DASHBOARD, '/partner/list'),
    registerPartner: path(ROOTS_DASHBOARD, '/partner/registerPartner'),
    managementPartner: (partner_id: string | undefined) =>
      path(ROOTS_DASHBOARD, `/partner/${partner_id}/managementPartner`),
    edit: (partner_id: string) => path(ROOTS_DASHBOARD, `/partner/${partner_id}/edit`),
  },
  productService: {
    root: path(ROOTS_DASHBOARD, '/productService'),
    createItem: path(ROOTS_DASHBOARD, '/productService/createItem'),
    list: path(ROOTS_DASHBOARD, '/productService/list'),
    management: (product_id: string) => path(ROOTS_DASHBOARD, `/productService/${product_id}/management`),
    edit: (product_id: string) => path(ROOTS_DASHBOARD, `/productService/${product_id}/edit`),
  },
  category: {
    root: path(ROOTS_DASHBOARD, '/category/root'),
    list: path(ROOTS_DASHBOARD, '/category/list'),
    createCategory: path(ROOTS_DASHBOARD, '/category/createCategory'),
    edit: (category_id: string) => path(ROOTS_DASHBOARD, `/category/${category_id}/edit`),
  },
  order: {
    root: path(ROOTS_DASHBOARD, '/order'),
    list: path(ROOTS_DASHBOARD, '/order/list'),
    details: (order_id: string) => path(ROOTS_DASHBOARD, `/order/${order_id}/details`)
  },
  collaborator: {
    root: path(ROOTS_DASHBOARD, '/collaborator'),
    list: path(ROOTS_DASHBOARD, '/collaborator/list'),
    createCollaborator: path(ROOTS_DASHBOARD, '/collaborator/createCollaborator')
  },
  shipmentType: { 
    root: path(ROOTS_DASHBOARD, '/shipmentType'),
    list: path(ROOTS_DASHBOARD, '/shipmentType/list'),
    createShipmentType: path(ROOTS_DASHBOARD, '/shipmentType/createShipmentType')
  },
  paymentMethods: { 
    root: path(ROOTS_DASHBOARD, '/paymentMethods'),
    list: path(ROOTS_DASHBOARD, '/paymentMethods/list'),
    createPaymentMethods: path(ROOTS_DASHBOARD, '/paymentMethods/createPaymentMethods')
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    // edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    // demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title: string) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
  report: {
    root: path(ROOTS_DASHBOARD, '/report/root'),
    list: path(ROOTS_DASHBOARD, '/report/list'),
    createReport: path(ROOTS_DASHBOARD, '/report/createReport'),
    details: (report_id: string) => path(ROOTS_DASHBOARD, `/report/${report_id}/details`),
  }
};

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
