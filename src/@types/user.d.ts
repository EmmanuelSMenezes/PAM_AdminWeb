export interface ICreateUser {
  email: string;
  password?: string;
  roleName: number;
  fullname: string;
  phone: string;
  document: string;
  generatedPassword: boolean;
}

export interface IUserResponse {
  user_id: string;
  admin_id: string;
  email: string;
  phone: string;
  active: boolean;
  role_id: string;
  password_generated: boolean;
  phone_verified: boolean;
  last_login: string;
  created_at: string;
  deleted_at: string;
  updated_at: string;
  role: Role;
  profile: Profile;
}

export interface Role {
  role_id: string;
  description: string;
  tag: string;
  active: boolean;
  created_at: string;
  deleted_at: string;
  updated_at: string;
}

export interface Profile {
  profile_id: string;
  fullname: string;
  avatar: string;
  document: string;
  active: boolean;
  created_at: string;
  deleted_at: string;
  updated_at: string;
  user_id: string;
}

// ----------------------------------------------------------------------

export interface IUser {
  admin_id: string;
  user: {
    isActiveCollaborator?: boolean;
    isCollaborator?: boolean;
    user_id: string;
    admin_id: string;
    email: string;
    phone: string;
    active: boolean;
    role_id: string;
    password_generated: boolean;
    last_login: string;
    created_at: string;
    deleted_at: string;
    updated_at: string;
    role: {
      role_id: string;
      description: string;
      tag: string;
      active: boolean;
      created_at: string;
      deleted_at: string;
      updated_at: string;
    };
    profile: {
      profile_id: string;
      fullname: string;
      avatar: string;
      document: string;
      active: boolean;
      created_at: string;
      deleted_at: string;
      updated_at: string;
      user_id: string;
    };
  };
  token: string;
  user_id: string;
}

export interface iUpdateUser {
  Email?: string;
  Fullname?: string;
  Avatar?: file;
  Phone?: string;
  Document?: string;
  Active?: boolean | undefined;
  User_id?: string;
  Avatar?: File | null;
  Phone_verified?: boolean | null;
}

export interface iPersonalization {
  logo?: File | string | null;
  color: string | null;
}

export type ForgotPasswordParams = {
  token: string;
  email: string;
  roleName: number;
};

export type ChangePasswordParams = {
  token: string;
  old_password: string;
  password: string;
  passwordConfirmation: string;
};

export type ResetPasswordParams = {
  token?: string;
  password: string;
  passwordConfirmation: string;
};

export type IUserSocialLink = {
  facebookLink: string;
  instagramLink: string;
  linkedinLink: string;
  twitterLink: string;
};

export type IUserProfileFollowers = {
  follower: number;
  following: number;
};

export type IUserProfileCover = {
  name: string;
  cover: string;
  role: string;
};

export type IUserProfileAbout = {
  quote: string;
  country: string;
  email: string;
  role: string;
  company: string;
  school: string;
};

export type IUserProfile = IUserProfileFollowers &
  IUserProfileAbout & {
    id: string;
    socialLinks: IUserSocialLink;
  };

export type IUserProfileFollower = {
  id: string;
  avatarUrl: string;
  name: string;
  country: string;
  isFollowed: boolean;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  postAt: Date | string | number;
  imageUrl: string;
};

export type IUserProfileFriend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type IUserProfilePost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date | string | number;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date | string | number;
    message: string;
  }[];
};

// ----------------------------------------------------------------------

export type IUserCard = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPosts: number;
  role: string;
};

// ----------------------------------------------------------------------

export type IUserAccountBillingCreditCard = {
  id: string;
  cardNumber: string;
  cardType: string;
};

export type IUserAccountBillingInvoice = {
  id: string;
  createdAt: Date | string | number;
  price: number;
};

export type IUserAccountBillingAddress = {
  id: string;
  name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
};

// ----------------------------------------------------------------------

export type IUserAccountNotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export enum RoleUser {
  ADM = 1,
  CONS = 2,
  PART = 3,
}