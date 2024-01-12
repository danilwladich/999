import useSWR, { Fetcher } from "swr";

export function useClientFetching<Data>(path: string) {
	const fetcher: Fetcher<Data, string> = async (query) => {
		const res = await fetch(path);

		if (!res.ok) {
			const errorText = await res.text();

			throw new Error(`Error: ${errorText}`);
		}

		const json = (await res.json()) as Data;

		return json;
	};

	return useSWR<Data, Error>(path, fetcher);
}
