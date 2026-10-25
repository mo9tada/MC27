import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationsCard from "./notifications/notifications-card";

export default async function AdminOverviewPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [pendingReservations, newMessages, spinsToday] = await Promise.all([
    prisma.reservation.count({ where: { status: "pending" } }),
    prisma.contactMessage.count({ where: { status: "new" } }),
    prisma.wheelSpin.count({ where: { createdAt: { gte: startOfDay } } }),
  ]);

  const stats = [
    { label: "Réservations en attente", value: pendingReservations },
    { label: "Nouveaux messages", value: newMessages },
    { label: "Tours de roue aujourd'hui", value: spinsToday },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
      <h1 className="text-3xl font-semibold tracking-tight">Tableau de bord</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={stat.label}
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-in fade-in slide-in-from-bottom-4 border-white/10 bg-[#102c4e]/60 text-white shadow-lg backdrop-blur duration-500 fill-mode-both transition-transform hover:-translate-y-1"
          >
            <CardHeader>
              <CardDescription className="text-[#c58d5a]">{stat.label}</CardDescription>
              <CardTitle className="text-3xl text-white">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>

      <NotificationsCard />
    </div>
  );
}
