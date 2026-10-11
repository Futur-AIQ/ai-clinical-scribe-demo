"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { PageHead } from "@/components/layout/PageHead";
import { PracticeName } from "@/components/layout/PracticeName";
import { Button, Card } from "@/components/ui";
import { InviteModal } from "./InviteModal";
import { TeamTable } from "./TeamTable";

export function TeamView() {
  const [inviting, setInviting] = useState(false);
  return (
    <>
      <PageHead
        title="Team"
        subtitle={
          <>
            People in <PracticeName /> who can record, review or bill
          </>
        }
        actions={
          <Button variant="primary" icon={UserPlus} onClick={() => setInviting(true)}>
            Invite Member
          </Button>
        }
      />
      <Card>
        <TeamTable />
      </Card>
      <InviteModal open={inviting} onClose={() => setInviting(false)} />
    </>
  );
}
