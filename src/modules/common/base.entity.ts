import { OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuidv4 } from "uuid";

export abstract class BaseEntity<Optional = never> {

    [OptionalProps]?: "createdAt" | "updatedAt" | Optional;

    @PrimaryKey({ type: "uuid" })
    id = uuidv4();

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}