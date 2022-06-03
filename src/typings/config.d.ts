export interface YamlConfig {
    debug: boolean;
    bot: {
        token: string;

    };
    database: {
        host: string;
        port: number;

    }
}