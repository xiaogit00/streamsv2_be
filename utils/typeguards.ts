import { NewStream, NewStreamTrade, NewTrade, StreamTradesRequest, Trade, UUID } from "../types";
import { validate } from 'uuid'


const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
}

const isNumber = (num: unknown): num is number => {
    return typeof Number(num) === "number";
  }

const parseString = (text: unknown): string => {
    if (!text || !isString(text)) {
        throw new Error('Incorrect or missing string.')
    }
    return text
}

const parseNumber = (text: unknown): number => {
    if (text === null || !isNumber(text)) {
        throw new Error('Incorrect or missing number.')
    }
    return text
}

const parseBool = (text: unknown): boolean => {
    if (text === null || typeof text !== 'boolean') {
        throw new Error('Incorrect or missing boolean.')
    }
    return text
}

const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
}

const parseDate = (date: unknown): Date => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error('Incorrect or missing date: ' + date);
}
	return new Date(date);
};

const parseCloseUUID = (id: string): UUID | null => {
    if (!id) return null
	if (!validate(id)) throw new Error('Incorrect or missing id.')
	return id;
};

export const parseUUID = (id: string): UUID => {
	if (!id || !validate(id)) throw new Error('Incorrect or missing uuid.')
	return id;
};

const parseTradeIdArray = (tradeIds: Array<string>): Array<UUID> => {
    tradeIds.map((tradeId: string) => {
        if (!validate(tradeId)) throw new Error('Incorrect or missing uuid.')
    })
    return tradeIds
}


export const toNewTrade = (body: any): NewTrade => {
    const newTrade: NewTrade = {
        ticker: parseString(body.ticker),
        name: parseString(body.name),
        qty: parseNumber(body.qty),
        price: parseNumber(body.price),
        type: parseBool(body.type),
        currency: parseString(body.currency),
        exchange: parseString(body.exchange),
        cost: parseNumber(body.cost),
        exchange_fees: parseNumber(body.exchange_fees),
        date: parseDate(body.date),
        close_id: parseCloseUUID(body.close_id)
      }
      return newTrade
}

export const toNewStream = (body: any): NewStream => {
    const newStream: NewStream = {
        ticker: parseString(body.ticker),
        stream_name: parseString(body.stream_name),
        currency: parseString(body.currency),
        exchange: parseString(body.exchange),
        date_created: parseDate(body.date_created)
      }
      return newStream
}

export const toNewStreamTrade = (body: any): NewStreamTrade => {
    const newStreamTrade: NewStreamTrade = {
        stream_id: parseUUID(body.stream_id),
        trade_id: parseUUID(body.trade_id)
      }
      return newStreamTrade
}

export const toBulkStreamTrades = (body: any): StreamTradesRequest => {
    const newStreamTradesRequest: StreamTradesRequest = {
        stream_id: parseUUID(body.stream_id),
        trades: parseTradeIdArray(body.trades)
      }
      return newStreamTradesRequest
}

export const toTrade = (body: any): Trade => {
    const trade: Trade = {
        id: parseUUID(body.id),
        ticker: parseString(body.ticker),
        name: parseString(body.name),
        qty: parseNumber(body.qty),
        price: parseNumber(body.price),
        type: parseBool(body.type),
        currency: parseString(body.currency),
        exchange: parseString(body.exchange),
        cost: parseNumber(body.cost),
        exchange_fees: parseNumber(body.exchange_fees),
        date: parseDate(body.date),
        close_id: parseCloseUUID(body.close_id)
      }
      return trade
}