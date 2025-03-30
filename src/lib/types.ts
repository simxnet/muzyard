export interface LanyardResponse {
	data: Data;
	success: boolean;
}

export interface Data {
	spotify?: Spotify;
	discord_user: DiscordUser;
}

export interface Spotify {
	timestamps: Timestamps;
	album: string;
	album_art_url: string;
	artist: string;
	song: string;
	track_id: string;
}

export interface Timestamps {
	start: number;
	end: number;
}

export interface DiscordUser {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	bot: boolean;
	global_name: string;
	display_name: string;
}
