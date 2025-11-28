import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = {
    driver: PostgreSqlDriver,
    extensions: [Migrator],
    dbName: "genzineers",
    password:"a",
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    metadataProvider: TsMorphMetadataProvider,
    dynamicImportProvider: id => import(id),
    debug: true
}

export default config;