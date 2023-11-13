import type { BaseModel, RecordModel } from "pocketbase";
import type { SupportedCompany } from "../companies";

export type AccessToken = {
	company: SupportedCompany;
	access_token: string;
	expires: string;
};

export type AccessTokenModel = AccessToken & BaseModel;
export type AccessTokenRecordModel = AccessToken & RecordModel;

export type RefreshableAccessToken = AccessToken & {
	refresh_token: string;
	refresh_expires: string;
};

export type KrogerAccessTokenResponse = {
	access_token: string;
	expires_in: number;
	token_type: string;
};

export type KrogerRefreshableAccessTokenResponse = KrogerAccessTokenResponse & {
	refresh_token: string; // NOTE: default expiration is 6 months
};
