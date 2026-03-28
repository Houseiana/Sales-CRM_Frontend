"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MessageCircle, Send, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { conversations as defaultConversations } from "@/lib/data";
import { conversationsApi, type ConversationItem } from "@/lib/api";
import { useLocale } from "@/lib/i18n/locale-context";

export function CommunicationsView() {
  const { t } = useLocale();
  const [apiConvs, setApiConvs] = useState<ConversationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [msgText, setMsgText] = useState("");

  useEffect(() => {
    conversationsApi.getAll().then((data) => {
      setApiConvs(data);
      if (data.length > 0) setSelectedId(data[0].id);
    }).catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!selectedId || !msgText.trim()) return;
    try {
      await conversationsApi.sendMessage(selectedId, {
        content: msgText, senderName: "Me", isFromAgent: true,
      });
      setMsgText("");
      const updated = await conversationsApi.getAll();
      setApiConvs(updated);
    } catch { /* ignore */ }
  };

  const conversations = apiConvs.length > 0
    ? apiConvs.map((c, i) => ({
        name: c.leadName || "Unknown", channel: c.channel,
        preview: c.lastMessage || "", time: new Date(c.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unread: c.unreadCount, active: c.id === (selectedId || apiConvs[0]?.id),
        id: c.id, messages: c.messages,
      }))
    : defaultConversations.map((c) => ({ ...c, id: c.name, messages: [] }));

  const activeConversation = conversations.find((c) => c.active) || conversations[0];
  const activeMessages = apiConvs.find((c) => c.id === selectedId)?.messages || [];

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.42fr_0.58fr]">
      <Card className="rounded-3xl border-stone-200/80 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg text-stone-950">{t.comms.conversations}</CardTitle>
              <p className="text-sm text-stone-500">{t.comms.recentInteractions}</p>
            </div>
            <Badge className="rounded-full border border-stone-200 bg-white text-stone-700">
              {conversations.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                c.active
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-stone-200 hover:bg-stone-50"
              }`}
            >
              <Avatar className="h-10 w-10 rounded-2xl">
                <AvatarFallback className="rounded-2xl bg-stone-950 text-xs text-white">
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-stone-950">{c.name}</p>
                  <span className="shrink-0 text-xs text-stone-400">{c.time}</span>
                </div>
                <p className="text-xs text-stone-500">{c.channel}</p>
                <p className="mt-1 truncate text-sm text-stone-600">{c.preview}</p>
              </div>
              {c.unread > 0 && (
                <Badge className="shrink-0 rounded-full bg-yellow-400 text-stone-950">
                  {c.unread}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 rounded-2xl">
                  <AvatarFallback className="rounded-2xl bg-stone-950 text-white">
                    {activeConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-stone-950">
                    {activeConversation.name}
                  </CardTitle>
                  <p className="text-sm text-stone-500">{activeConversation.channel}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-2xl border-stone-200">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-2xl border-stone-200">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 rounded-2xl bg-stone-50 p-4">
              {activeMessages.map((msg) => (
                <div key={msg.id} className={msg.isFromAgent ? "flex flex-row-reverse gap-3" : "flex gap-3"}>
                  <Avatar className="h-8 w-8 rounded-xl">
                    <AvatarFallback className={`rounded-xl text-xs ${msg.isFromAgent ? "bg-yellow-100 text-stone-950" : "bg-stone-950 text-white"}`}>
                      {msg.senderName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={msg.isFromAgent
                    ? "rounded-2xl rounded-tr-md bg-stone-950 p-3 text-white shadow-sm"
                    : "rounded-2xl rounded-tl-md bg-white p-3 shadow-sm"
                  }>
                    <p className={`text-sm ${msg.isFromAgent ? "" : "text-stone-700"}`}>{msg.content}</p>
                    <p className={`mt-1 text-xs ${msg.isFromAgent ? "text-white/50" : "text-stone-400"}`}>
                      {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
              </div>
              ))}
              {activeMessages.length === 0 && (
                <p className="py-4 text-center text-sm text-stone-400">{t.noData}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Input
                placeholder={t.comms.typeMessage}
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="h-11 flex-1 rounded-2xl border-stone-200"
              />
              <Button onClick={handleSend} className="h-11 rounded-2xl bg-stone-950 text-white hover:bg-stone-800">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-stone-200/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-stone-950">{t.comms.channelOverview}</CardTitle>
            <p className="text-sm text-stone-500">
              {t.comms.activityBreakdown}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                [t.comms.whatsapp, `24 ${t.comms.active}`, MessageCircle],
                [t.comms.calls, `8 ${t.today.toLowerCase()}`, Phone],
                [t.comms.emailChannel, `12 ${t.comms.threads}`, Mail],
                [t.comms.inbox, `6 ${t.comms.unread}`, Inbox],
              ].map(([label, count, Icon]) => {
                const IconComp = Icon as React.ComponentType<{ className?: string }>;
                return (
                  <div key={label as string} className="rounded-2xl border border-stone-200 p-4 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100">
                      <IconComp className="h-5 w-5 text-stone-700" />
                    </div>
                    <p className="text-sm font-medium text-stone-950">{label as string}</p>
                    <p className="text-xs text-stone-500">{count as string}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
