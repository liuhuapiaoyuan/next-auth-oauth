import type { DBAdapterUser, IUserService } from "next-auth-oauth";
import { prisma } from "@/lib/db";
import crypto from 'crypto'
import {
    CredentialsSignin,
} from "next-auth";


function randomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * 定义转换器
 */
export class AuthService implements IUserService {

    comparePassword(password: string, hashedPassword: string, salt: string) {
        return this.encryptPassword(password, salt) === hashedPassword;
    }

    encryptPassword(password: string, salt: string) {
        const hash = crypto.createHash('sha256');
        hash.update(password + salt);
        return hash.digest('hex');
    }

    async login(
        username: string,
        password: string,
    ): Promise<DBAdapterUser> {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        const isMatch = user ? await this.comparePassword(password, user.password ?? "", user.salt ?? "") : false;
        console.log("sadasd")
        if (!user || !isMatch) {
            throw new CredentialsSignin("账号或者密码错误");
        }
        return {
            id: user.id,
            name: user.nickname,
            email: user.email!,
            image: user.image,
            emailVerified: user.emailVerified,
            username: user.username!,
        };
    }
    /**
   * 创建新账户
   * @param username 
   * @param password 
   * @param nickname 
   * @returns 
   */
    public async createUser(
        username: string,
        password: string,
        nickname: string,
        email?: string,
        image?: string
    ) {
        const userExists = await prisma.user.findUnique({
            where: { username },
        });
        if (userExists) {
            throw new Error("Username already exists");
        }
        const salt = randomString(16);
        return prisma.user.create({
            data: {
                username,
                password: password ? this.encryptPassword(password, salt) : undefined,
                nickname,
                salt,
                email,
                image
            },
        });
    }

    async registUser(user: {
        username: string;
        password: string;
        formData: Record<string, string>;
    }): Promise<DBAdapterUser> {
        const { username, password, formData } = user;
        const adapterUser = await this.createUser(username, password,
            formData?.nickname ?? "NextjsBoy_" + randomString(4),
            formData?.email,
            formData?.image
        );
        return {
            id: adapterUser.id,
            name: adapterUser.nickname,
            email: adapterUser.email!,
            image: adapterUser.image,
            emailVerified: adapterUser.emailVerified,
            username: adapterUser.username!,
        };
    }

    /**
     * 获得绑定的第三方数据
     */
    async listAccount(userId: string) {
        return prisma.account.findMany({
            where: {
                userId: userId,
            },
        });
    }
}
