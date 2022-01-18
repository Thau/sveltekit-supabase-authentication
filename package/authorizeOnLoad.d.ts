export declare function authorizeOnLoad(openPaths: any, loginPath: any): ({ url, session }: {
    url: any;
    session: any;
}) => Promise<{
    status?: undefined;
    redirect?: undefined;
} | {
    status: number;
    redirect: any;
}>;
