import React, { useState } from 'react'
import HeaderBox from '../../components/HeaderBox'
import TotalBalanceBox from '../../components/TotalBalanceBox'
import RightSideBar from '@/components/RightSideBar';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async () => {
	const loggedIn = await getLoggedInUser();

	return (
		<section className='home'>
			<div className='home-content'>
				<header className='home-header'>
					<HeaderBox
						type='greeting'
						title='Welcome'
						user={loggedIn?.name.split(' ')[0] || 'Guest'}
						subtext='Access and manage your account and transactions efficiently.'
					/>

					<TotalBalanceBox
						accounts={[]}
						totalBanks={1}
						totalCurrentBalance={1250.35}
					/>
				</header>
			</div>

			<RightSideBar
				user={loggedIn}
				transactions={[]}
				banks={[{
					currentBalance: 1250.35,
				}, {
					currentBalance: 257.85,
				}]}
			/>
		</section>
	)
}

export default Home