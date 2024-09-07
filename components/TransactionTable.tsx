import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils'


const CategoryBadge = ({ category }: { category: string }) => {
    return (
        <div className={cn('category-badge')} >
            <div className={cn('size-2 rounded-full')} />
            <p className={cn('text-[12px] font-medium')}>{category}</p>
        </div >
    )
}

const TransactionTable = ({ transactions }: TransactionTableProps) => {
    return (
        <Table>
            <TableHeader className='bg-[#f9fafb]'>
                <TableRow>
                    <TableHead className="pax-2">Transaction</TableHead>
                    <TableHead className="pax-2">Amount</TableHead>
                    <TableHead className="pax-2">Status</TableHead>
                    <TableHead className="pax-2">Date</TableHead>
                    <TableHead className="pax-2 max-lg:hidden">Channel</TableHead>
                    <TableHead className="pax-2 max-lg:hidden">Category</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    transactions?.map((transaction: Transaction) => {
                        const status = getTransactionStatus(new Date(transaction.date))
                        const amount = formatAmount(transaction.amount)

                        const isDebit = transaction.type === 'debit';

                        return (
                            <TableRow key={transaction.id} className={
                                isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9] !over-bg-none !border-b-default'
                            }>
                                <TableCell className='pl-2 pr-10'>
                                    <div className='flex items-center gap-3'>
                                        <h1 className='text-14 truncate font-semibold text-[#344054]'>
                                            {removeSpecialCharacters(transaction.name)}
                                        </h1>
                                    </div>
                                </TableCell>

                                <TableCell className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-' ? 'text-[#F44438]' : 'text-[#039855]'}`}>
                                    {isDebit ? `-${amount}` : amount}
                                </TableCell>

                                <TableCell className='pl-2 pr-10 '>
                                    <CategoryBadge category={status} />
                                </TableCell>

                                <TableCell className='min-w-32 pl-2 pr-10 '>
                                    {formatDateTime(new Date(transaction.date)).dateTime}
                                </TableCell>

                                <TableCell className="max-lg:hidden pl-2 pr-10 capitalize" >
                                    {transaction.paymentChannel}
                                </TableCell>

                                <TableCell className="max-lg:hidden pl-2 pr-10 ">
                                    <CategoryBadge category={transaction.category} />
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>

    )
}

export default TransactionTable