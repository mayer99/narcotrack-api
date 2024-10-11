import { Project } from 'src/projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AccessToken } from './access_token.entity';
import { User } from 'src/users/entities/user.entity';
import { SubjectType } from '../subject-type.enum';

@Entity("client_credentials", { schema: "auth" })
export class ClientCredentials {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true, name: "external_id" })
    externalId: string

    @Column({
        type: 'enum',
        enum: SubjectType,
        nullable: true
    })
    type: SubjectType
    
    @Column({ unique: true, name: "client_id" })
    clientId: string

    @Column({ name: "hashed_client_secret"})
    hashedClientSecret: string

    @Column("text", { array: true })
    scopes: string[]

    @Column()
    name: string

    @Column({ nullable: true })
    description?: string

    @OneToMany(() => AccessToken, (accessToken) => accessToken.clientCredentials)
    accessTokens: AccessToken[]

    @ManyToOne(() => Project, (project) => project.clientCredentials, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "project_id" })
    project?: Project

    @ManyToOne(() => User, (user) => user.clientCredentials, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "user_id" })
    user?: User

    @CreateDateColumn({ type: "timestamptz", name: "issued_at" })
    issuedAt: Date

}