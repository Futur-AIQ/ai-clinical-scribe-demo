import { toast } from "@/store/ui-store";

/** Copies text and toasts the result. Falls back to execCommand when the Clipboard API is blocked. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    ta.remove();
    toast(ok ? "Copied to clipboard" : "Copy is blocked here. Select the text and copy it manually.", ok ? "ok" : "warn");
  }
}
