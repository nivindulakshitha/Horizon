import React, { use, useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
    const router = useRouter();
    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            /* const data = await createLinkToken(user);
            setToken(data?.linkToken); */
        }

        getLinkToken();
    });

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        /* await exchangePublicToken({
            publicToken: public_token,
            user
        }); */
        router.push('/');
    }, [user])

    const config: PlaidLinkOptions = {
        token,
        onSuccess

    }

    const { open, ready } = usePlaidLink(config);

    return (
        <>
            {variant === "primary" ? (
                <Button
                    className='plaidlink-primary'
                    onClick={() => open()}
                    disabled={!ready}
                >
                    Connect a bank account
                </Button>
            ) : variant === "ghost" ? (
                <Button>
                    Connect a bank account
                </Button>
            ) : (
                <Button>
                    Connect a bank account
                </Button>
            )}
        </>
    )
}

export default PlaidLink