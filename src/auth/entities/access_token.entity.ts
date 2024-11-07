import { Project } from 'src/projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ClientCredentials } from './client_credentials.entity';
import { User } from 'src/users/entities/user.entity';
import { ClientType } from '../client-type.enum';

@Entity("access_tokens", { schema: "auth" })
export class AccessToken {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, name: "external_id" })
    externalId: string

    @Column({
        type: 'enum',
        enum: ClientType,
        nullable: true
    })
    type: ClientType

    @Column({ unique: true, name: "hashed_secret" })
    hashedSecret: string

    @Column("text", { array: true })
    scopes: string[]

    @ManyToOne(() => ClientCredentials, (clientCredentials) => clientCredentials.accessTokens, { onDelete: "CASCADE" })
    @JoinColumn({ name: "client_credentials" })
    clientCredentials: ClientCredentials

    @ManyToOne(() => Project, (project) => project.accessTokens, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "project_id" })
    project?: Project

    @ManyToOne(() => User, (user) => user.accessTokens, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "user_id" })
    user?: User

    @Column({ type: "timestamptz", name: "expires_at" })
    expiresAt: Date

    @CreateDateColumn({ type: "timestamptz", name: "issued_at" })
    issuedAt: Date

} 