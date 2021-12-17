// @ts-check
import fs, { existsSync } from "fs";
import path from "path";

const getWrapper = (/** @type {any} */ obj) => {
    if (typeof obj === 'string')
        return String;
    if (typeof obj === 'number')
        return Number;
    if (typeof obj === 'bigint')
        return BigInt;
    if (typeof obj === 'boolean')
        return Boolean;
    if (typeof obj === 'symbol')
        return Symbol;
    if (typeof obj === 'object')
        return Object;
    return null;
}

const checkType = (type, obj) => {
    if (typeof type === 'function')
        return getWrapper(obj) === type;

    let current = true;
    for (let e in type) {
        current = checkType(type[e], obj[e]);
        if (!current) return false;
    }
    return true;
}

export default class JsonDB {
    /**
     * @type {string}
     */
    parentPath;
    /**
     * @type {string}
     */
    fileName;
    /**
     * @param {string} fileName 
     * @param {string} parentPath 
     */
    constructor(fileName, parentPath) {
        if (!existsSync(path.join(parentPath, fileName)))
            fs.appendFileSync(path.join(parentPath, fileName), "[]");
        this.fileName = fileName;
        this.parentPath = parentPath;
    }
    /**
     * @param {object} schem 
     */
    schema = schem => {
        const pth = path.join(this.parentPath, this.fileName);
        const pointer = this;
        return class Schema {
            /**
             * @type {JsonDB}
             */
            parent = pointer;
            /**
             * @type {object}
             */
            obj
            /**
             * @param {object} obj 
             */
            constructor(obj) {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        throw new Error("Invalid object");
                }
                this.obj = obj;
            }

            save = async () => {
                const current = JSON.parse(
                    await new Promise(
                        (res, rej) =>
                            fs.readFile(pth, (err, data) =>
                                err ? rej(err) : res(data.toString())
                            )
                    )
                );
                current.push(this.obj);
                return new Promise((res, rej) =>
                    fs.writeFile(pth, JSON.stringify(current), err =>
                        err ? rej(err) : res(current)
                    )
                )
            }

            static match = obj => {
                for (const e in schem) {
                    if (!checkType(schem[e], obj[e]))
                        return false;
                }
                return true;
            }
            /**
             * @param {object} obj 
             * @param {number} count 
             */
            static find = async (obj, count = undefined) => 
                await pointer.find(obj, count, Schema);
        }
    }
    /**
     * @param {object} obj 
     * @param {Function} schem
     * @param {number} count
     */
    find = async (obj, count = undefined, schem = undefined) => {
        // @ts-ignore
        if (schem.parent !== this)
            throw new Error("Invalid schema");
        const current = JSON.parse(
            await new Promise(
                (res, rej) =>
                    fs.readFile(path.join(this.parentPath, this.fileName), (err, data) =>
                        err ? rej(err) : res(data.toString())
                    )
            )
        );
        const result = [];
        for (let e of current)
            for (let i in obj) {
                if (count && result.length === count)
                    return result;
                // @ts-ignore
                if (
                    (e[i] === obj[i] &&
                        // @ts-ignore
                        !schem || schem?.match(e))
                ) result.push(e);
            }
        return result;
    }
}
