import React, { useState } from 'react'
import HeaderBox from '../../components/HeaderBox'
import TotalBalanceBox from '../../components/TotalBalanceBox'
import RightSideBar from '@/components/RightSideBar';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
	const loggedIn = await getLoggedInUser();
	const accounts = await getAccounts({
		userId: loggedIn?.$id,
	});

	if (!accounts) return;

	const accountsData = accounts?.data;

	const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;

	const account = await getAccount({ appwriteItemId });


	console.log({accountsData, account});

	return (
		<section className='home'>
			<div className='home-content'>
				<header className='home-header'>
					<HeaderBox
						type='greeting'
						title='Welcome'
						user={loggedIn?.firstName || 'Guest'}
						subtext='Access and manage your account and transactions efficiently.'
					/>

					<TotalBalanceBox
						accounts={accountsData}
						totalBanks={accounts?.totalBanks}
						totalCurrentBalance={accounts?.totalCurrentBalance}
					/>
				</header>
			</div>

			<RightSideBar
				user={loggedIn}
				transactions={accounts?.transactions}
				banks={accountsData?.slice(0, 2)}
			/>
		</section>
	)
}

export default Home