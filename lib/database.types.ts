// Database types for Supabase tables
// These match the schema in implementation_plan.md

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            opportunities: {
                Row: {
                    id: string
                    company_name: string
                    logo_short: string | null
                    amount: number | null
                    stage: string | null
                    probability: number | null
                    sentiment: string | null
                    next_action: string | null
                    next_action_date: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    company_name: string
                    logo_short?: string | null
                    amount?: number | null
                    stage?: string | null
                    probability?: number | null
                    sentiment?: string | null
                    next_action?: string | null
                    next_action_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    company_name?: string
                    logo_short?: string | null
                    amount?: number | null
                    stage?: string | null
                    probability?: number | null
                    sentiment?: string | null
                    next_action?: string | null
                    next_action_date?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            interactions: {
                Row: {
                    id: string
                    opportunity_id: string | null
                    type: string | null
                    summary: string | null
                    sentiment: string | null
                    date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    opportunity_id?: string | null
                    type?: string | null
                    summary?: string | null
                    sentiment?: string | null
                    date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    opportunity_id?: string | null
                    type?: string | null
                    summary?: string | null
                    sentiment?: string | null
                    date?: string | null
                    created_at?: string
                }
            }
            contracts: {
                Row: {
                    id: string
                    title: string
                    status: string | null
                    value: number | null
                    content: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    status?: string | null
                    value?: number | null
                    content?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    status?: string | null
                    value?: number | null
                    content?: string | null
                    created_at?: string
                }
            }
            calendar_events: {
                Row: {
                    id: string
                    title: string
                    date: string | null
                    time: string | null
                    type: string | null
                    status: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    date?: string | null
                    time?: string | null
                    type?: string | null
                    status?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    date?: string | null
                    time?: string | null
                    type?: string | null
                    status?: string | null
                    created_at?: string
                }
            }
        }
    }
}
