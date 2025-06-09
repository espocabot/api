import { Redis } from "@upstash/redis/cloudflare";

const redis = new Redis({
	url: "https://able-tuna-31346.upstash.io",
	token: "********",
});
