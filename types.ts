export interface Trade {
    id: string,
    ticker: string,
    name: string,
    qty: number,
    price: number,
    type: boolean,
    currency: string,
    exchange: string,
    cost: number,
    exchange_fees: number,
    date: Date,
    close_id: string | null
}

export interface Stream {
    id: string,
    ticker: string,
    stream_name: string,
    currency: string,
    exchange: string,
    date_created: Date,
}

export interface StreamTrade {
    id: string,
    stream_id: UUID,
    trade_id: UUID
}

export interface StreamTradesRequest {
    stream_id: UUID,
    trades: UUID[]
}

export type UUID = string

export type NewTrade = Omit<Trade, 'id'>

export type NewStream = Omit<Stream, 'id'>

export type NewStreamTrade = Omit<StreamTrade, 'id'>