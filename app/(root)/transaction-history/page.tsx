import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionTable from '@/components/TransactionTable';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import React from 'react'

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
    const currentPage = Number(page as string) || 1;
    const loggedIn = await getLoggedInUser();
    const accounts = await getAccounts({
        userId: loggedIn?.$id,
    });

    if (!accounts) return;

    const accountsData = accounts?.data;

    const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;

    const account = await getAccount({ appwriteItemId });

    const rowsPerPage = 10;
    const totalPages = Math.ceil(account?.transactions.length / rowsPerPage);
    const indexOfLastTransaction = currentPage * rowsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

    const currentTransactions = account?.transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    return (
        <div className="transactions">
            <div className="transaction-header">
                <HeaderBox title='Transaction History' subtext='See your bank details and transactions.' />
            </div>

            <div className="space-y-6">
                <div className="transactions-account">
                    <div className="flex flex-col gap-2">
                        <h2 className='text-18 font-bold text-white'>
                            {account?.data.name}
                        </h2>
                        <p className='text-14 text-blue-25'>
                            {account?.data.officialName}
                        </p>
                        <p className="text-12 font-semibld tracking-[1.1px] text-white">
                            ⬤⬤⬤⬤ ⬤⬤⬤⬤ ⬤⬤⬤⬤
                            <span className="text-14">
                                &nbsp;{ account?.data.mask }
                            </span>
                        </p>
                    </div>

                    <div className="transactions-account-balance">
                        <p className="text-14">
                            Current Balance
                        </p>
                        <p className="text-24 text-center font-bold">
                            { formatAmount(account?.data.currentBalance) }
                        </p>
                    </div>
                </div>

                <section className='flex w-full gap-6 flex-col'>
                    <TransactionTable transactions={currentTransactions} origin='transaction-history' />
                    {
                        totalPages > 1 && (
                            <div className="m-y-4 w-full">
                                <Pagination page={currentPage} totalPages={totalPages} />
                            </div>
                        )
                    }
                </section>
            </div>
        </div>
    )
}

export default TransactionHistory