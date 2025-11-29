import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = {
    driver: PostgreSqlDriver,
    extensions: [Migrator],
    user: process.env.POSTGRESDB_USER,
    dbName: process.env.POSTGRESDB_DATABASE,
    host: process.env.DB_HOST,
    password:process.env.POSTGRESDB_ROOT_PASSWORD,
    port: Number(process.env.POSTGRESDB_DOCKER_PORT),
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    metadataProvider: TsMorphMetadataProvider,
    dynamicImportProvider: id => import(id),
    debug: true
}

export default config;