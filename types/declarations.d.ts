/// <reference types="node" />
import http from "http";
import qs from "query-string";
import { Socket } from "net";
import https from "https";
export declare type Method = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS" | "PATCH" | "CONNECT" | "TRACE";
/**
 * Context of a request
 */
export interface Context extends Record<string, any> {
    /**
     * End the response manually
     */
    responseEnded: boolean;
    /**
     * The response
     */
    response: string;
    /**
     * Status code
     */
    statusCode: number;
    /**
     * Parsed query
     */
    readonly query: {
        [k: string]: string;
    };
    /**
     * Parsed body
     */
    readonly body: qs.ParsedQuery;
    /**
     * The page url
     */
    readonly url: string;
    /**
     * Append a file content to response
     */
    writeFile(path: string): void;
    /**
     * Get response headers
     */
    header(name: string): string | number | string[];
    /**
     * Set response headers
     */
    header(name: string, value?: string | number | readonly string[]): void;
    /**
     * Set multiple headers
     */
    headers(headers: {
        [name: string]: string | number | readonly string[];
    }): void;
    /**
     * Get request headers
     */
    headers(): http.IncomingHttpHeaders;
    /**
     * Request socket
     */
    readonly socket: Socket;
    /**
     * Request method
     */
    readonly method: Method;
    /**
     * Request HTTP version
     */
    readonly httpVersion: string;
    /**
     * Server IPv4 address
     */
    readonly remoteAddress: string;
    /**
     * The raw request
     */
    readonly rawRequest: {
        /**
         * Request
         */
        readonly req: http.IncomingMessage;
        /**
         * Response
         */
        readonly res: http.ServerResponse;
    };
    /**
     * The subhost
     */
    readonly subhost: string;
}
/**
 * A route handler
 */
export declare type Handler = {
    [method in Method]?: (ctx: Context) => Promise<void>;
};
/**
 * Next function
 */
export declare type NextFunction = () => Promise<void>;
/**
 * A middleware
 */
export interface Middleware {
    invoke(ctx: Context, next: NextFunction): Promise<void>;
}
/**
 * Server options
 */
export interface SimpleOptions {
    /**
     * Server options
     */
    options?: http.ServerOptions | https.ServerOptions;
    /**
     * Toggle HTTPS mode
     */
    httpsMode?: boolean;
    /**
     * Target port
     */
    port?: number;
    /**
     * Target hostname
     */
    hostname?: string;
    /**
     * Backlog
     */
    backlog?: number;
}
/**
 * The simple server
 */
export interface SimpleServer {
    /**
     * The simple HTTP or HTTPS server
     */
    readonly server: http.Server | https.Server;
    /**
     * The generator
     */
    [Symbol.asyncIterator](): AsyncGenerator<http.ServerResponse, any, unknown>;
}
/**
 * Schema instance
 * Result after calling new Schema(obj: object)
 */
export declare type SchemaInstance = {
    /**
     * Save the created object to the database
     */
    save(): Promise<object>;
    /**
     * Delete the created object from the database
     */
    del(): Promise<object>;
    /**
     * Update the created object in the database
     * @param obj The replacement object
     */
    update(obj: object): Promise<object>;
};
/**
 * Database events
 */
export declare type DBEvents = "save-item" | "update-item" | "delete-item" | "clear-schema" | "clear-database" | "drop-database" | "drop-schema";
/**
 * Schema type
 */
export declare type Schema = {
    /**
     * Create a new schema instance
     * @param obj The initial object
     */
    new (obj: object): SchemaInstance;
    /**
     * Read the schema from the database
     */
    read(): object[];
    /**
     * Check whether current object matches the parameter object
     * @param obj The object to check
     */
    match(obj: object): boolean;
    /**
     * Schema name
     */
    schem: string;
    /**
     * Find objects that match the parameter object
     * @param obj The object to check
     * @param count The number of objects to return
     * @param except If set to true, find objects that do not match the parameter object
     */
    find(obj?: object, count?: number, except?: boolean): Promise<object[]>;
    /**
     * Find an object that match the parameter object
     * @param obj The object to check
     * @param except If set to true, find the object that do not match the parameter object
     */
    find(obj?: object, count?: 1, except?: boolean): Promise<object>;
    /**
     * Create new objects and check whether they match the schema
     * @param obj Objects to check
     */
    create(...obj: object[]): SchemaInstance[];
    /**
     * Find the parameter object in the database and update it with the updated object
     * @param obj the object to be updated
     * @param updateObj the updated object
     */
    update(obj: object, updateObj: object): Promise<object>;
    /**
     * Clear the objects that belongs to the schema
     */
    clear(): Promise<void>;
    /**
     * Delete all objects that matches the parameter object
     * @param obj The object to check
     * @param except If set to true, delete all objects that do not match the parameter object
     */
    deleteMatch(obj?: object, except?: boolean): Promise<void>;
    /**
     * Drop all the objects that belongs to the schema. The schema after this action will be unusable
     */
    drop(): Promise<void>;
};
/**
 * Application
 */
export interface Application {
    /**
     * Start the main application
     */
    start(): Promise<http.Server | https.Server>;
    /**
     * Set app configs
     * @param configs the configs
     */
    config(configs: AppConfigs): void;
}
/**
 * App configs
 */
export interface AppConfigs {
    /**
     * App root path. Defaults to "."
     */
    projectPath?: string;
    /**
     * Static directory. Defaults to "public"
     */
    static?: string;
    /**
     * HTTP server options
     */
    httpOptions?: {
        /**
         * Server port. Defaults to 80
         */
        port?: number;
        /**
         * Server hostname. Defaults to "localhost"
         */
        hostname?: string;
        /**
         * HTTPS mode. Defaults to false
         */
        httpsMode?: boolean;
        /**
         * HTTP backlog. Defaults to 0
         */
        backlog?: number;
        /**
         * Advanced options
         */
        advanced?: http.ServerOptions | https.ServerOptions;
    };
}
/**
 * Cookie options
 */
export interface CookieOptions {
    maxAge?: number;
    decode?(encodedURIComponent: string): string;
    encode?(encodedURIComponent: string): string;
    domain?: string;
    path?: string;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: true | 'lax' | 'strict' | 'none';
}
