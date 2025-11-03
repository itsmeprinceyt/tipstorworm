import { RowDataPacket } from "mysql2";

export interface SettingRow extends RowDataPacket {
    setting_key: string;
    setting_value: number | boolean;
}