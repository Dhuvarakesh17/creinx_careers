"use client";

import { useRef, useState } from "react";

type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
};

type TopicId = "services" | "pricing" | "timeline";

type SuggestedTopic = {
  id: TopicId;
  label: string;
};

const suggestedTopics: SuggestedTopic[] = [
  { id: "services", label: "What services do you offer?" },
  { id: "pricing", label: "How much does a project cost?" },
  { id: "timeline", label: "How long does development take?" },
];

function getTopicIntro(topic: TopicId) {
  if (topic === "services") {
    return "Great choice. I am now in Services mode. Ask about web apps, mobile apps, AI automation, or marketing support.";
  }

  if (topic === "pricing") {
    return "Great choice. I am now in Pricing mode. Share your scope and I can give a practical estimate range and what affects cost.";
  }

  return "Great choice. I am now in Timeline mode. Tell me your product size and I can break down realistic delivery phases.";
}

function getTopicReply(topic: TopicId, input: string) {
  const message = input.toLowerCase();

  if (topic === "services") {
    if (message.includes("web") || message.includes("website")) {
      return "For web, we build high-performance sites, dashboards, and full SaaS platforms with modern stacks and SEO-ready architecture.";
    }
    if (message.includes("mobile") || message.includes("app")) {
      return "For mobile, we deliver Android and iOS experiences using native or cross-platform approaches based on performance and budget goals.";
    }
    if (message.includes("ai") || message.includes("automation")) {
      return "For AI and automation, we build assistants, workflow automations, and integrations to reduce manual operations and speed up teams.";
    }
    return "Our core services are web development, mobile apps, AI automation, and digital growth support. Tell me your use case and I will suggest the right service mix.";
  }

  if (topic === "pricing") {
    if (message.includes("mvp") || message.includes("basic")) {
      return "An MVP usually has the shortest scope and lowest budget band. Final pricing depends on features, integrations, and UI depth.";
    }
    if (message.includes("enterprise") || message.includes("scale")) {
      return "Enterprise builds require architecture planning, security, roles, and integrations, which increases effort and pricing bands.";
    }
    return "Pricing is scope-driven. Key factors are features, integrations, design complexity, and timeline urgency. Share requirements and we can give a tailored estimate.";
  }

  if (message.includes("mvp") || message.includes("basic")) {
    return "A focused MVP often takes around 2 to 4 weeks depending on design and backend complexity.";
  }
  if (message.includes("complex") || message.includes("enterprise")) {
    return "Complex multi-module platforms typically run 8 to 16 weeks with staged milestones and weekly deliveries.";
  }
  return "Timeline depends on scope, but we usually split delivery into discovery, design, build, testing, and launch to keep progress clear.";
}

function getBotReply(input: string) {
  const message = input.toLowerCase();

  if (
    message.includes("service") ||
    message.includes("offer") ||
    message.includes("what do you do")
  ) {
    return "We provide web app development, mobile app development, AI automation, and digital growth support. Share your idea, and we can suggest the best approach.";
  }

  if (
    message.includes("cost") ||
    message.includes("price") ||
    message.includes("budget")
  ) {
    return "Project cost depends on scope and timeline. Most projects are estimated after a short requirement discussion. You can send details in the contact form for a custom quote.";
  }

  if (
    message.includes("time") ||
    message.includes("duration") ||
    message.includes("how long") ||
    message.includes("timeline")
  ) {
    return "Timelines vary by complexity. Small builds may take 2 to 4 weeks, while larger products can take 8 to 16 weeks with phased delivery.";
  }

  if (
    message.includes("job") ||
    message.includes("career") ||
    message.includes("hiring") ||
    message.includes("role")
  ) {
    return "You can explore open roles on our jobs page and apply directly. If you need help with a specific role, mention it in the contact form.";
  }

  if (
    message.includes("contact") ||
    message.includes("email") ||
    message.includes("phone")
  ) {
    return "You can reach us at careers@creinx.com or +91 98765 43210, Monday to Friday, 9am to 6pm IST.";
  }

  return "I can help with services, pricing, timelines, hiring, and contact details. Ask me one of these, or send your full requirement through the contact form.";
}

export function SupportChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [showSuggestedTopics, setShowSuggestedTopics] = useState(true);
  const nextMessageId = useRef(2);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "bot",
      text: "Hi there! I am the Creinx Assistant. How can I help you today?",
    },
  ]);

  function sendChatMessage(rawText: string, forcedReply?: string) {
    const text = rawText.trim();
    if (!text) {
      return;
    }

    const userId = nextMessageId.current;
    const botId = nextMessageId.current + 1;
    nextMessageId.current += 2;

    const userMessage: ChatMessage = {
      id: userId,
      role: "user",
      text,
    };

    const botMessage: ChatMessage = {
      id: botId,
      role: "bot",
      text:
        forcedReply ??
        (activeTopic ? getTopicReply(activeTopic, text) : getBotReply(text)),
    };

    setChatMessages((prev) => [...prev, userMessage, botMessage]);
    setChatInput("");
  }

  function chooseSuggestedTopic(topic: SuggestedTopic) {
    setActiveTopic(topic.id);
    setShowSuggestedTopics(false);
    sendChatMessage(topic.label, getTopicIntro(topic.id));
  }

  function resetSuggestedTopics() {
    setActiveTopic(null);
    setShowSuggestedTopics(true);
    sendChatMessage(
      "Change topic",
      "Sure. Pick a new suggested topic and I will continue in that mode.",
    );
  }

  return (
    <div className="pointer-events-none fixed bottom-8 right-6 z-50 md:right-8">
      {isChatOpen ? (
        <aside
          className="pointer-events-auto mb-4 h-145 w-85 overflow-hidden rounded-3xl border border-[#1E3A5F] bg-[#081A38] shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          data-lenis-prevent
        >
          <header className="flex items-center justify-between border-b border-[#1E3A5F] bg-[#0D2A4B] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-content-center rounded-full bg-[#0B6EA8] text-white">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="8"
                    width="16"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M9 8V6a3 3 0 0 1 6 0v2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <circle cx="9" cy="13" r="1" fill="currentColor" />
                  <circle cx="15" cy="13" r="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#F0F4FF]">
                  Creinx Support
                </h3>
                <p className="flex items-center gap-2 text-sm text-[#D1E4FF]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                  Online
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close chat"
              className="grid h-9 w-9 place-content-center rounded-full text-[#A8B8D8] hover:bg-white/10 hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </header>

          <div className="flex h-107.5 flex-col">
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-normal ${
                    message.role === "bot"
                      ? "bg-[#243B5C] text-[#F0F4FF]"
                      : "ml-auto bg-[#0EA5C6] text-white"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            {showSuggestedTopics ? (
              <div className="border-t border-[#1E3A5F] bg-[#0D2A4B] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A8B8D8]">
                  Suggested Topics
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedTopics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => chooseSuggestedTopic(topic)}
                      className="rounded-full border border-[#0EA5C6] px-3 py-1.5 text-sm text-[#22D3EE] hover:bg-[#0EA5C6]/10"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between border-t border-[#1E3A5F] bg-[#0D2A4B] px-4 py-2.5">
                <p className="text-xs uppercase tracking-[0.12em] text-[#7EB3D8]">
                  Topic Mode: {activeTopic ?? "general"}
                </p>
                <button
                  type="button"
                  onClick={resetSuggestedTopics}
                  className="rounded-full border border-[#1E5877] px-3 py-1 text-xs text-[#9ED7FF] hover:bg-[#0EA5C6]/10"
                >
                  Change Topic
                </button>
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendChatMessage(chatInput);
              }}
              className="flex items-center gap-3 border-t border-[#1E3A5F] bg-[#092346] px-4 py-4"
            >
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type a message..."
                className="h-12 flex-1 rounded-full border border-[#1E5877] bg-[#102B52] px-4 text-sm text-[#F0F4FF] outline-none placeholder:text-[#7F94B3]"
              />
              <button
                type="submit"
                className="grid h-12 w-12 place-content-center rounded-full bg-[#0EA5C6] text-white"
                aria-label="Send message"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 11.5 20.5 4 14 20l-2.8-6.2L3 11.5Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </aside>
      ) : null}

      <button
        type="button"
        onClick={() => setIsChatOpen((prev) => !prev)}
        aria-label={isChatOpen ? "Close support chat" : "Open support chat"}
        className="pointer-events-auto grid h-18 w-18 place-content-center rounded-full bg-linear-to-b from-[#22D3EE] to-[#0891B2] text-white shadow-[0_10px_30px_rgba(14,165,198,0.45)]"
      >
        {isChatOpen ? (
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2.4"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 12c0-4.4 3.6-8 8-8h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5l-4.5 3 .7-3H8c-2.2 0-4-1.8-4-4Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <circle cx="10" cy="12" r="1" fill="currentColor" />
            <circle cx="13" cy="12" r="1" fill="currentColor" />
            <circle cx="16" cy="12" r="1" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
