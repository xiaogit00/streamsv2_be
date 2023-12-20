import { NewTrade, Trade } from "../types";
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
    if (!text || !isNumber(text)) {
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

const parseCloseUUID = (id: string): string | null => {
    if (!id) return null
	if (!validate(id)) throw new Error('Incorrect or missing id.')
	return id;
};

const parseUUID = (id: string): string => {
	if (!id || !validate(id)) throw new Error('Incorrect or missing uuid.')
	return id;
};


export const toNewTrade = (body: any): NewTrade => {
    console.log('here: ',body.type)
    const newTrade: NewTrade = {
        ticker: parseString(body.ticker),
        name: parseString(body.name),
        qty: parseNumber(body.qty),
        price: parseNumber(body.price),
        type: parseBool(body.type),
        currency_id: parseUUID(body.currency_id),
        exchange_id: parseUUID(body.exchange_id),
        cost: parseNumber(body.cost),
        exchange_fees: parseNumber(body.exchange_fees),
        date: parseDate(body.date),
        close_id: parseCloseUUID(body.close_id)
      }
      return newTrade
}

export const toTrade = (body: any): Trade => {
    const trade: Trade = {
        id: parseUUID(body.id),
        ticker: parseString(body.ticker),
        name: parseString(body.name),
        qty: parseNumber(body.qty),
        price: parseNumber(body.price),
        type: parseBool(body.type),
        currency_id: parseUUID(body.currency_id),
        exchange_id: parseUUID(body.exchange_id),
        cost: parseNumber(body.cost),
        exchange_fees: parseNumber(body.exchange_fees),
        date: parseDate(body.date),
        close_id: parseCloseUUID(body.close_id)
      }
      return trade
}