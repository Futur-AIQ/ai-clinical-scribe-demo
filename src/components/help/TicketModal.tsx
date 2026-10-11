"use client";

import type { FormEvent } from "react";
import { Button, Field, Input, Modal, Textarea, toast } from "@/components/ui";

const FORM_ID = "ticket-form";

/** Collects a support message. Nothing leaves the browser. */
export function TicketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
    toast("Message saved. In this demo nothing is sent.", "info");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Message support"
      subtitle="Describe the problem and we reply by email"
      footer={
        <>
          <Button className="ml-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} variant="primary">
            Send
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="flex flex-col gap-3.5">
        <Field label="Subject" htmlFor="tk-subject">
          <Input id="tk-subject" name="subject" autoComplete="off" />
        </Field>
        <Field label="Message" htmlFor="tk-message">
          <Textarea id="tk-message" name="message" rows={5} />
        </Field>
      </form>
    </Modal>
  );
}
