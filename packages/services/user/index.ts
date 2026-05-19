import {db, eq} from '@repo/database';
import {usersTable} from '@repo/database/models/user';
import {createUserWithEmailAndPasswordInput, generateUserTokenPayload, GenerateUserTokenPayloadType, signInUserWithEmailAndPasswordInput, type CreateUserWithEmailAndPasswordInputType, type SignInUserWithEmailAndPasswordInputType} from './model';
import {randomBytes, createHmac} from 'node:crypto'
import * as jwt from 'jsonwebtoken';
import { env } from '../env';
class UserService {

  private async getUserByEmail(email: string) {
    try {
      const result = await db.select().from(usersTable).where(eq(usersTable.email, email));
      if(!result || result.length===0) return null;
      return result[0];
    } catch (err) {
      console.error('getUserByEmail - DB query failed', { sql: 'select id, full_name, email, email_verified, profile_image_url, salt, password, created_at, updated_at from users where email = $1', params: email, err });
      throw err;
    }
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const {id} = await generateUserTokenPayload.parseAsync(payload);
    const token = jwt.sign({id}, env.JWT_SECRET);
    return {token};
  }

  private async verifyUserToken(token: string) {
    try {
      const res = jwt.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType
      return res;
    } catch(error) {
      throw new Error('invalid token')
    }
  }

  private async getUserInfoById(id: string) {
    const user = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      fullName: usersTable.fullName,
      profileImageUrl: usersTable.profileImageUrl
    }).from(usersTable).where(eq(usersTable.id, id));

    if(!user || user.length ===0) throw new Error(`User with id ${id} does not exists`);

    return user[0];
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const {fullName, email, password} = await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingEmail = await this.getUserByEmail(email);
    if(existingEmail) throw new Error(`user with email ${email} already exists`);

    const salt = randomBytes(16).toString('hex');
    const hash = createHmac('sha256', salt).update(password).digest('hex');

    const userInsertResult = await db.insert(usersTable).values({email, fullName, salt, password:hash}).returning({
      id: usersTable.id
    });

    if(!userInsertResult || userInsertResult.length===0 || !userInsertResult[0]?.id) throw new Error('something went wrong while creating a user');

    const userId = userInsertResult[0].id
    const {token} = await this.generateUserToken({id: userId})

    return {
      id: userId,
      token
    }
  }

  public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordInputType) {
    const {email, password} =  await signInUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);

    if(!existingUser) throw new Error(`User with email ${email} does not exist`);

    if(!existingUser.password || !existingUser.salt) throw new Error('Invalid authentication method');

    const hash = createHmac('sha256', existingUser.salt).update(password).digest('hex');

    if(hash !== existingUser.password) throw new Error('Invalid email or password');

    const {token} = await this.generateUserToken({id: existingUser.id});

    return {
      id: existingUser.id,
      token
    }
  }

  public async verifyAndDecodeUserToken(token: string) {
    const {id} = await this.verifyUserToken(token);
    const userInfo = await this.getUserInfoById(id);
    return {...userInfo}
  }

}

export default UserService;