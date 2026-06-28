import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ReplyDialog from "./reply-dialog";

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight">Contact Q&A</h1>

      <div className="animate-in fade-in overflow-hidden rounded-xl border border-white/10 bg-[#102c4e]/60 backdrop-blur duration-500">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/70">From</TableHead>
              <TableHead className="text-white/70">Subject</TableHead>
              <TableHead className="text-white/70">Message</TableHead>
              <TableHead className="text-white/70">Status</TableHead>
              <TableHead className="text-white/70">Received</TableHead>
              <TableHead className="text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className="border-white/10 text-white">
                <TableCell>
                  <div className="font-medium">{message.name}</div>
                  <div className="text-xs text-white/50">{message.email}</div>
                </TableCell>
                <TableCell className="max-w-[160px] truncate text-sm text-white/70">{message.subject}</TableCell>
                <TableCell className="max-w-[220px] truncate text-sm text-white/70">{message.message}</TableCell>
                <TableCell>
                  <Badge variant={message.status === "answered" ? "secondary" : "outline"}>
                    {message.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-white/70">{message.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <ReplyDialog
                    id={message.id}
                    name={message.name}
                    subject={message.subject}
                    message={message.message}
                    existingReply={message.reply}
                  />
                </TableCell>
              </TableRow>
            ))}

            {messages.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-center text-white/50">
                  No messages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
