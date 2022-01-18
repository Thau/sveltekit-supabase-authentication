export declare function handleAuth(supabase: any): any;
export declare function addAuthToSession(request: any): {
    user: any;
    access_token: any;
    authenticated: any;
};
export declare function onAuthStateChange(event: any, sb_session: any): Promise<void>;
