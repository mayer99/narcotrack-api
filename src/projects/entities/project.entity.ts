import { AccessToken } from "src/auth/entities/access_token.entity";
import { ClientCredentials } from "src/auth/entities/client_credentials.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("projects", { schema: "projects" })
export class Project {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column()
    name: string

    @ManyToOne(() => User, (user) => user.projects)
    user: User

    @OneToMany(() => AccessToken, (accessToken) => accessToken.project)
    accessTokens: AccessToken[]

    @OneToMany(() => ClientCredentials, (clientCredentials) => clientCredentials.project)
    clientCredentials: ClientCredentials[]

    @CreateDateColumn({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
    updatedAt: Date
} 