declare module 'express-async-handler' {
    import { RequestHandler } from 'express';

    function asyncHandler<
        P = any,
        ResBody = any,
        ReqBody = any,
        ReqQuery = any,
    >(
        handler: (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>) => void | Promise<void>
    ): RequestHandler<P, ResBody, ReqBody, ReqQuery>;

    export = asyncHandler;
}
