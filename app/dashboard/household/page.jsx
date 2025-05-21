"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, RotateCw, UserPlus, UserX } from "lucide-react";
import { da } from "date-fns/locale";

function HouseholdPage() {
  const { data: session } = useSession();
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);

  const fetchHousehold = async () => {
    try {
      setLoading(true);

      if (!session?.user?.householdId) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `/api/households/${session.user.householdId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch household");
      }

      const data = await response.json();
      setHousehold(data.household);
      setMembers(data.members);
    } catch (error) {
      console.error("Error fetching household:", error);
      toast.error("Failed to load household data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (session?.user?.id) {
      fetchHousehold();
    }
  }, [session?.user?.id, session?.user?.householdId]);

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setInviting(true);

    try {
      const response = await fetch("/api/households/invite", {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          householdId: session?.user?.householdId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to invite member");
      }
      toast.success("Invitation sent successfully");
      setEmail("");
      setOpenInviteDialog(false);
      fetchHousehold();
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to invite member");
    } finally {
      setInviting(false);
    }
  };

  const removeMember = async (memberId) => {
    try {
      const response = await fetch(`/api/households/members/${memberId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(data.message || "Failed to remove member");
      }

      toast.success("Member removed successfully");
      fetchHousehold();
    } catch (error) {
      console.error("Error remove member:", error);
      toast.error("Failed to remove member");
    }
  };

  if (!session?.user?.householdId && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Household</h2>
          <p className="text-muted-foreground">
            Create or join a household to manage containers together.
          </p>
        </div>

        <Card>
          <CardContent className="p-10">
            <div className="text-center space-y-6">
              <h3 className="text-lg font-semibold">
                You are not part of a household yet
              </h3>
              <p className="text-muted-foreground">
                Create a new household to start tracking containers and
                collaborate with family members.
              </p>
              <Button asChild>
                <Link href="/dashboard/household/create">
                  Create New Household
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Household Management
          </h2>
          <p className="text-muted-foreground">
            Manage your household members and settings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchHousehold}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {session?.user?.isHouseHead && (
            <Dialog open={openInviteDialog} onOpenChange={setOpenInviteDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite a member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your household. The user must
                    have an existing account.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteMember} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={inviting}>
                    {inviting ? "Sending Invitation..." : "Send Invitation"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <div className="h-7 bg-muted animate-pulse rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded"></div>
              <div className="h-10 bg-muted animate-pulse rounded"></div>
              <div className="h-10 bg-muted animate-pulse rounded"></div>
            </div>
          </CardContent>
        </Card>
      ) : household ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{household.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Household ID: {household._id}
              </p>
              <p className="text-muted-foreground">
                Created on {new Date(household.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Household Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    {session?.user?.isHouseHead && (
                      <TableHead className="w-20">Action</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell className="font-medium">
                        {member.name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        {member.isHouseHead ? "Head of House" : "Member"}
                      </TableCell>
                      {session?.user?.isHouseHead && (
                        <TableCell>
                          {member._id !== session.user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMember(member._id)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-3">
              <p>Unable to load household information.</p>
              <Button onClick={fetchHousehold}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default HouseholdPage;
