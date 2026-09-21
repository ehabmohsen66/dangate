import {integer,sqliteTable,text,index} from 'drizzle-orm/sqlite-core';
export const consultations=sqliteTable('consultations',{
id:text('id').primaryKey(),name:text('name').notNull(),company:text('company').notNull().default(''),jobTitle:text('job_title').notNull().default(''),email:text('email').notNull(),phone:text('phone').notNull().default(''),country:text('country').notNull(),service:text('service').notNull(),challenge:text('challenge').notNull(),ipHash:text('ip_hash').notNull(),createdAt:integer('created_at').notNull()
},table=>[index('consultation_rate_limit').on(table.ipHash,table.createdAt)]);
