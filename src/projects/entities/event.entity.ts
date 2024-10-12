import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Severity } from '../severity.enum';
import { AccessToken } from 'src/auth/entities/access_token.entity';
import { ClientCredentials } from 'src/auth/entities/client_credentials.entity';

@Entity("events", { schema: "projects" })
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column()
    message: string

    @Column()
    type: string

    @Column({
        type: 'enum',
        enum: Severity
    })
    severity: Severity

    @Column()
    device: string

    @ManyToOne(() => Project, { onDelete: "CASCADE" })
    project: Project

    @ManyToOne(() => AccessToken)
    accessToken: AccessToken

    @ManyToOne(() => ClientCredentials)
    clientCredentials: ClientCredentials

    @Column({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @CreateDateColumn({ type: "timestamptz", name: "received_at" })
    receivedAt: Date

}
