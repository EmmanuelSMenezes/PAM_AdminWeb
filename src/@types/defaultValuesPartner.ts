export const defaultValuesPartner = {
  partner_id: '',
  legal_name: '',
  fantasy_name: '',
  email: '',
  phone_number: '',
  document: '',
  branch: {
    branch_name: '',
    document: '',
    address: {
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      zip_code: '',
      active: true,
      latitude: '',
      longitude: '',
    },
  },

  active: true,
  user_id: '',
};

export const defaultValuesPartnerArray = {
  partner_id: '',
  legal_name: '',
  fantasy_name: '',
  document: '',
  email: '',
  phone_number: '',
  branch: [
    {
      branch_id: '',
      branch_name: '',
      document: '',
      phone: '',
      partner_id: '',
      address: {
        address_id: '',
        street: '',
        number: '',
        complement: '',
        district: '',
        city: '',
        state: '',
        zip_code: '',
        active: true,
        updated_by: '',
        latitude: '',
        longitude: '',
      },
      updated_by: '',
    }
  ],
  updated_by: '',
  user_id: '',
  admin_id: '',
  active: true,
};
