import { logoutAccount } from '@/lib/actions/user.actions';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React from 'react'

const Footer = ({ user, type = "desktop" }: FooterProps) => {
    const router = useRouter();

    const handleLogOut = async () => {
        const loggedOut = await logoutAccount();

        if (loggedOut) {
            router.push('/auth/sign-in');
        }
    }

    return (
        <footer className="footer">
            <div className={type === 'mobile' ? 'footer_name-mobile' : 'footer_name'}>
                <p className='text-xl font-bold text-gray-700'>
                    {user?.name.split(' ')[0].charAt(0) || 'G'}
                </p>
            </div>

            <div className={type === 'mobile' ? 'footer_email-mobile' : 'footer_email'}>
                <h1 className='text-14 truncate font-semibold text-gray-700'>
                    {user?.name || 'G'}
                </h1>

                <p className="text-14 truncate font-normal text-gray-600">
                    {user?.email || ''}
                </p>
            </div>

            <div className="footer_image" onClick={handleLogOut}>
                <Image src="icons/logout.svg" fill alt={`Logout ${user?.name.split(' ')[0]}`} />
            </div>
        </footer>
    )
}

export default Footer