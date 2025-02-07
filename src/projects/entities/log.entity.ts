import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Project } from "src/projects/entities/project.entity";
import { Severity } from "../severity.enum";
import { AccessToken } from "src/auth/entities/access_token.entity";
import { ClientCredentials } from "src/auth/entities/client_credentials.entity";
import { Device } from "./device.entity";

@Entity("logs", { schema: "projects" })
export class Log {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    externalId: string

    @Column("text")
    message: string

    @Column({
        type: 'enum',
        enum: Severity
    })
    severity: Severity

    @ManyToOne(() => Device, { onDelete: "CASCADE" })
    device: Device

    @ManyToOne(() => Project, { onDelete: "CASCADE" })
    project: Project

    @Column({ type: "timestamptz", name: "created_at" })
    createdAt: Date

    @CreateDateColumn({ type: "timestamptz", name: "received_at" })
    receivedAt: Date

}