import { AccessToken } from "src/auth/entities/access_token.entity";
import { ClientCredentials } from "src/auth/entities/client_credentials.entity";
import { Project } from "src/projects/entities/project.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("users", { schema: "users" })
export class User {
 
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column()
    name: string

    @OneToMany(() => Project, (project) => project.user)
    projects: Project[]

    @OneToMany(() => ClientCredentials, (clientCredentials) => clientCredentials.user)
    clientCredentials: ClientCredentials[]

    @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
    accessTokens: AccessToken[]

    @CreateDateColumn({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
    updatedAt: Date
} 