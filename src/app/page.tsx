import Link from "next/link";

export const fetchCache = "force-no-store";

export default function Home() {
	return (
		<div className="flex flex-col gap-2 max-w-2xl">
			<h1 className="text-3xl font-black">Muzyard</h1>
			<p className="text-[var(--subtitle)]">
				Beautiful yet simple Spotify listening widget leveraging Lanyard API
			</p>
			<Link
				className="px-4 py-2 bg-[#ca241d] w-fit text-white rounded-xl hover:scale-110 font-bold duration-150"
				href="https://github.com/simxnet/muzyard"
			>
				See on GitHub
			</Link>
			<p>
				See it in action:{" "}
				<Link className="underline italic" href="/widget/1076700780175831100">
					https://muzyard.vercel.app/widget/1076700780175831100
				</Link>
			</p>
			<img src="/widget/1076700780175831100" alt="simxnet spotify" />
			<p>
				there are more themes :P (currently <em>dark, light and catppuccin</em>)
			</p>
			<em className="text-sm">
				you need to be on Lanyard's Discord server for this to work.
			</em>
			<em className="text-sm">not affiliated with Lanyard.</em>
			<em className="text-sm">
				made by{" "}
				<Link className="underline" href="https://github.com/simxnet">
					@simxnet
				</Link>
				{" <3"}
			</em>
		</div>
	);
}
