export interface Trade {
    id: string,
    ticker: string,
    name: string,
    qty: number,
    price: number,
    type: boolean,
    currency_id: string,
    exchange_id: string,
    cost: number,
    exchange_fees: number,
    date: Date,
    close_id: string | null
}

export type NewTrade = Omit<Trade, 'id'>