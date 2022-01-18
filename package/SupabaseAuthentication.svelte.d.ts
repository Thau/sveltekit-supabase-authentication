import { SvelteComponentTyped } from "svelte";
export declare let openPaths: any;
export declare let loginPath: any;
export declare const load: ({ url, session }: {
    url: any;
    session: any;
}) => Promise<{
    status?: undefined;
    redirect?: undefined;
} | {
    status: number;
    redirect: any;
}>;
import { SupabaseClient } from '@supabase/supabase-js';
declare const __propDef: {
    props: {
        supabase: SupabaseClient;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type SupabaseAuthenticationProps = typeof __propDef.props;
export declare type SupabaseAuthenticationEvents = typeof __propDef.events;
export declare type SupabaseAuthenticationSlots = typeof __propDef.slots;
export default class SupabaseAuthentication extends SvelteComponentTyped<SupabaseAuthenticationProps, SupabaseAuthenticationEvents, SupabaseAuthenticationSlots> {
}
export {};
