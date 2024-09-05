"use server";
import { createSessionClient } from "../appwrite";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";

export async function signUp(userData: SignUpParams) {
    const { email, password, firstName, lastName } = userData;

    try {
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });


        return parseStringify(newUserAccount);
    }
    catch (error) {
        console.error("Error signing up user: ", error);
    }
}

export async function signIn({ email, password }: signInProps) {
    try {
        const { account } = await createAdminClient();
        const response = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", response.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(response);
    }
    catch (error) {
        console.error("Error signing in user: ", error);
    }
}

export async function getLoggedInUser() {
    try {
        const { account } = await createSessionClient();
        const user = await account.get();
        return parseStringify(user);
    } catch (error) {
        console.error("Error getting logged in user: ", error);
        return null;
    }
}

export async function logoutAccount() { 
    try {
        const { account } = await createSessionClient();
        cookies().delete("appwrite-session");
        await account.deleteSession("current");
    } catch (error) { 
        console.error("Error signing out user: ", error);
        return null;
    }
}