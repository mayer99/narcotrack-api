import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Project } from "src/projects/entities/project.entity";
import { Severity } from "../severity.enum";
import { AccessToken } from "src/auth/entities/access_token.entity";
import { ClientCredentials } from "src/auth/entities/client_credentials.entity";

@Entity("logs", { schema: "projects" })
export class Log {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column("text", { array: true })
    messages: string[]

    @Column({
        type: 'enum',
        enum: Severity
    })
    severity: Severity

    @Column()
    device: string

    @ManyToOne(() => Project)
    project: Project

    @ManyToOne(() => ClientCredentials)
    clientCredentials: ClientCredentials

    @Column({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @CreateDateColumn({ type: "timestamptz", name: "received_at" })
    receivedAt: Date
    
}