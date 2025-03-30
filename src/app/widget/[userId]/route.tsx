import type { LanyardResponse } from "@/lib/types";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

// This code is so shit (i made it in 1h ig lol pls dont blame me)

// fuck cache.
export const revalidate = 0;
export const fetchCache = "force-no-store";
// ts driving me insane.

function songData(
	start: number,
	end: number,
): { progress: string; duration: string; barWidth: number } {
	if (start === 0 || end === 0)
		return {
			progress: "0:00",
			duration: "0:00",
			barWidth: 0,
		};

	const currentTime = Date.now();

	const durationInMs = end - start;

	function formatTime(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
	}

	const progressInMs = currentTime - start;

	const progressPercentage = Math.min((progressInMs / durationInMs) * 100, 100);

	const barWidth = progressPercentage;

	const formattedDuration = formatTime(durationInMs);
	const formattedProgress = formatTime(progressInMs);

	return {
		progress: formattedProgress,
		duration: formattedDuration,
		barWidth: barWidth,
	};
}

const themes = {
	dark: {
		bg: "#17171a",
		fg: "#ffffff",
		bar: "#27272a",
		sub: "#b0b0b4",
		accent: "#22e888",
	},
	light: {
		bg: "#ffffff",
		fg: "#191816",
		bar: "#e2daf1",
		sub: "#5b5a56",
		accent: "#22e888",
	},
	catppuccin: {
		bg: "#181926",
		fg: "#cad3f5",
		bar: "#24273a",
		sub: "#b4baf3",
		accent: "#7186fa",
	},
	oxocarbon: {
		bg: "#161616",
		fg: "#ffffff",
		bar: "#535050",
		sub: "#cfcfcf",
		accent: "#c592ff",
	},
	molokai: {
		bg: "#1b1d1e",
		fg: "#f8f8f0",
		bar: "#293739",
		sub: "#eaebeb",
		accent: "#f42670",
	},
	discord: {
		bg: "#37393e",
		fg: "#ffffff",
		bar: "#44475a",
		sub: "#dcddde",
		accent: "#7387cf",
	},
	transparent: {
		bg: "transparent",
		fg: "#ffffff",
		bar: "#44475a",
		sub: "#dcddde",
		accent: "#22e888",
	},
};

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> },
) {
	const searchParams = req.nextUrl.searchParams;
	const theme = (searchParams.get("theme") as keyof typeof themes) ?? "dark";
	const blurbg = searchParams.has("blurbg");
	const border = searchParams.has("border");
	const showuser = searchParams.has("showuser");
	const { userId } = await params;

	// so if cache doesn't fucks me
	const timestamp = Date.parse(new Date().toString());
	const lanyardUser: LanyardResponse = await (
		await fetch(
			`https://api.lanyard.rest/v1/users/${userId}?tid=${timestamp}`,
			{ cache: "no-store", next: { revalidate: 0 } },
		)
	).json();

	console.log(lanyardUser);

	if (!lanyardUser.success)
		return Response.json({ error: true, message: "invalid user" });

	const spotify = lanyardUser.data.spotify;
	const user = lanyardUser.data.discord_user;

	const { duration, progress, barWidth } = songData(
		spotify?.timestamps.start ?? 0,
		spotify?.timestamps.end ?? 0,
	);

	const host = process.env.NEXT_PUBLIC_URL;

	const currentTheme = themes[theme];

	return new ImageResponse(
		<div
			style={{
				backgroundColor: currentTheme.bg,
				color: currentTheme.fg,
			}}
			tw="w-full h-full rounded-2xl p-12 flex flex-col"
		>
			{blurbg && spotify && (
				<div
					style={{
						backgroundImage: `url('${spotify.album_art_url}')`,
						backgroundSize: "cover",
						filter: "blur(20px)",
					}}
					tw="w-screen h-screen opacity-5 absolute"
				/>
			)}

			{showuser && (
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						marginBottom: "20px",
						gap: 12,
						alignItems: "center",
					}}
				>
					<img
						src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
						width={50}
						height={50}
						alt={user.username}
						style={{
							borderRadius: "9999px",
						}}
					/>
					<h3>{user.username}</h3>
				</div>
			)}
			<div
				className="w-full"
				style={{ display: "flex", justifyContent: "space-between" }}
			>
				<div tw="flex flex-row items-center">
					<img
						style={{
							border: border ? "1px solid" : "none",
							borderColor: border ? currentTheme.accent : "transparent",
						}}
						alt="ok"
						src={spotify?.album_art_url ?? `${host}/broken.png`}
						tw="w-44 h-44 rounded-2xl"
					/>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: -25,
						}}
					>
						<h1 tw="ml-5 font-black leading-none">
							{spotify?.song ?? "Not listening to anything"}
						</h1>
						<p tw="flex ml-5" style={{ color: currentTheme.sub }}>
							In {spotify?.album ?? "Nowhere"}
						</p>
						<p tw="flex ml-5" style={{ color: currentTheme.sub }}>
							By {spotify?.artist ?? "Nobody"}
						</p>
					</div>
				</div>
				<img alt="spotify" src={`${host}/spotify.png`} width={50} height={50} />
			</div>
			<div tw="relative flex mt-10">
				<div
					tw="w-full h-5 rounded-md"
					style={{ backgroundColor: currentTheme.bar }}
				/>
				<div
					style={{
						width: `${barWidth}%`,
						backgroundColor: currentTheme.accent,
					}}
					tw="h-5 rounded-md absolute"
				/>
			</div>
			<div tw="flex justify-between">
				<p>{progress}</p>
				<p>{duration}</p>
			</div>
		</div>,
		{
			width: 900,
			height: showuser ? 430 : 355,
			headers: {
				"Cache-Control": "no-cache",
				"x-vercel-cache": "max-age=0",
			},
		},
	);
}
