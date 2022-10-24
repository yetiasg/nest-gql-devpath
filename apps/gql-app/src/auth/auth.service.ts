import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '../role/role.type';
import { UserService } from '../user/user.service';

type Auth0UserProfileData = {
  email: string;
  given_name: string;
  family_name: string;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(UserService) private userService: UserService,
  ) {}

  async validateUser(
    token: string | null = null,
    payload: JwtPayload,
  ): Promise<any> {
    const userWithExternalId = await this.userService.getOneByExternalId(
      payload.sub,
    );

    if (!!userWithExternalId)
      return userWithExternalId.isActive ? userWithExternalId : null;

    const {
      email,
      given_name: firstName,
      family_name: lastName,
      sub: externalId,
    } = await this.fetchUserProfile(token, payload);

    const userByEmail = await this.userService.getOneByEmail(email);

    if (userByEmail) {
      return this.userService.update(userByEmail.id, {
        externalId,
        firstName,
        lastName,
        isActive: true,
      });
    }

    const newUser = await this.userService.create({
      externalId,
      email,
      firstName,
      lastName,
      role: Role.CUSTOMER,
      isActive: true,
    });

    return newUser;
  }

  async fetchUserProfile(
    token: string | null,
    payload: JwtPayload,
  ): Promise<Auth0UserProfileData> {
    const options = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const { data } = await this.httpService.axiosRef.get(
      `${payload.iss}userinfo`,
      options,
    );

    return data;
  }
}
