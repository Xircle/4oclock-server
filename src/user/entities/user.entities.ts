import { CoreEntity } from "src/common/entities/common.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class User extends CoreEntity {
    @Column()
    username: string;

    @Column()
    password: string
}