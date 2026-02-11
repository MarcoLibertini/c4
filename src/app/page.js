// src/app/page.js
import HomeClient from "@/app/_home/HomeClient";
import { getLanding } from "@/lib/landingServer";

export default async function HomePage() {
  const landing = await getLanding();
  return <HomeClient landing={landing} />;
}
