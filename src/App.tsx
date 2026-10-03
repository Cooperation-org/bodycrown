import type { ComponentType } from "react";
import useReveal from "@/hooks/useReveal";
import CrownieChatPage from "@/pages/CrownieChatPage";
import HomePage from "@/pages/HomePage";
import JoinPage from "@/pages/JoinPage";
import ManifestoPage from "@/pages/ManifestoPage";
import MeetCrowniePage from "@/pages/MeetCrowniePage";
import PhilosophyPage from "@/pages/PhilosophyPage";

// Plain path routing: every link is a full page load, so no router library is needed.
const routes: Record<string, ComponentType> = {
  "/meet-crownie": MeetCrowniePage,
  "/philosophy": PhilosophyPage,
  "/about": ManifestoPage,
  "/join": JoinPage,
  "/crownie": CrownieChatPage,
};

export default function App() {
  useReveal();
  const Page = routes[window.location.pathname] ?? HomePage;
  return <Page />;
}
