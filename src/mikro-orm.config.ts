import { Migrator } from "@mikro-orm/migrations";
import { GeneratedCacheAdapter, Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import dotenv from "dotenv";
import { existsSync, readFileSync } from 'node:fs';

const options = {} as Options;

dotenv.config();

if (process.env.NODE_ENV === 'production' && existsSync('./temp/metadata.json')) {
  options.metadataCache = {
    enabled: true,
    adapter: GeneratedCacheAdapter,
    // temp/metadata.json can be generated via `npx mikro-orm-esm cache:generate --combine`
    options: {
      data: JSON.parse(readFileSync('./temp/metadata.json', { encoding: 'utf8' })),
    },
  };
} else {
  options.metadataProvider = (await import('@mikro-orm/reflection')).TsMorphMetadataProvider;
}

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
    dynamicImportProvider: id => import(id),
    metadataProvider: TsMorphMetadataProvider,
    debug: true,
    ...options
}

export default config;