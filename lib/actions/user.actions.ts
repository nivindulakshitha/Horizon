"use server";
import { createSessionClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { createAdminClient } from "../appwrite";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const { 
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export async function signUp({ password, ...userData}: SignUpParams) {
    const { email, firstName, lastName } = userData;
    let newUserAccount;

    try {
        const { account, databases } = await createAdminClient();

        newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        if (!newUserAccount) {
            throw new Error("Error creating user account");
        }

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: "personal",
        });

        if (!dwollaCustomerUrl) {
            throw new Error("Error creating Dwolla customer");
        }

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await databases.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }

        );

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });


        return parseStringify(newUser);
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

export async function createLinkToken(user: User) {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ["auth"] as Products[],
            language: "en",
            country_codes: ["US"] as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);
        return parseStringify({
            linkToken: response.data.link_token,
        });
    } catch (error) {
        console.error("Error creating link token: ", error);
        return null;
    }
}

export async function createBankAccount({ userId, bankId, accountId, accessToken, fundingSourceUrl, sharableId }: createBankAccountProps) {
    try {
        const { databases } = await createAdminClient();

        const bankAccount = await databases.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                sharableId,
            }
        )

        return parseStringify(bankAccount);
    } catch (error) {
        console.error("Error creating bank account: ", error);
        return null;
    }
}

export async function exchangePublicToken({ publicToken, user }: exchangePublicTokenProps) {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        }

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        if (!fundingSourceUrl) {
            throw new Error("Error adding funding source");
        }

        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            sharableId: encryptId(accountData.account_id),
        });

        revalidatePath("/");

        return parseStringify({
            publicTokenExchange: 'complete',
        });

    } catch (error) {
        console.error("Error exchanging public token: ", error);
        return null
    }
}

export async function getBanks({ userId }: getBanksProps) { 
    try {
        const { databases } = await createAdminClient();
        const banks = await databases.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal("userId", [userId])]
        );

        return parseStringify(banks.documents);
    } catch (error) {
        console.error("Error getting banks: ", error);
        return null;
    }
}

export async function getBank({ documentId }: getBankProps) {
    try {
        const { databases } = await createAdminClient();
        const banks = await databases.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal("$id", [documentId])]
        );

        return parseStringify(banks.documents[0]);
    } catch (error) {
        console.error("Error getting banks: ", error);
        return null;
    }
}