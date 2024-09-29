export interface CreateUserRequest {
  userName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  password: string;
  city: string;
  description: string;
  facebookLink: string;
  githubLink: string;
  school: string;
  avatarUrl: string;
}

export interface UpdateUserRequest {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  fullName: string;
  city: string;
  description: string;
  facebookLink: string;
  githubLink: string;
  school: string;
  avatarUrl: string;
}

export interface UserView {
  userName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  city: string;
  description: string;
  facebookLink: string;
  githubLink: string;
  school: string;
  avatarUrl: string;
  createdAt: Date;
}

export interface ChangePasswordRequest {
  userName: string;
  currentPassword: string;
  newPassword: string;
}
