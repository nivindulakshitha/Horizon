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
import { formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from '@/lib/utils'


const TransactionTable = ({ transactions }: TransactionTableProps) => {
    return (
        <Table>
            <TableHeader className='bg-[#f9fafb]'>
                <TableRow>
                    <TableHead className="pax-2">Transaction</TableHead>
                    <TableHead className="pax-2">Amount</TableHead>
                    <TableHead className="pax-2">Status</TableHead>
                    <TableHead className="pax-2">Date</TableHead>
                    <TableHead className="pax-2 max-md:hidden">Channel</TableHead>
                    <TableHead className="pax-2 max-md:hidden">Category</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    transactions?.map((transaction: Transaction) => {
                        const status = getTransactionStatus(new Date(transaction.date))
                        const amount = formatAmount(transaction.amount)

                        const isDebit = transaction.type === 'debit';

                        return (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <div>
                                        <h1>
                                            {removeSpecialCharacters(transaction.name)}
                                        </h1>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    {isDebit ? `-${amount}` : amount }
                                </TableCell>

                                <TableCell>
                                    <span className={`status ${status}`}>
                                        {status}
                                    </span>
                                </TableCell>

                                <TableCell>
                                    {formatDateTime(new Date(transaction.date)).dateTime}
                                </TableCell>

                                <TableCell className="max-md:hidden">
                                    {transaction.paymentChannel}
                                </TableCell>

                                <TableCell className="max-md:hidden">
                                    {transaction.category}
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