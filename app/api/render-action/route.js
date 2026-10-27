import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";

/**
 * INTENTIONALLY VULNERABLE ENDPOINT — training lab only.
 *
 * Recreates the vulnerability *class* behind CVE-2025-55182 ("react2shell"):
 * an internal server-action style dispatcher that is reachable without
 * authentication and trusts a client-supplied "action reference" to decide
 * whether to run server-side code. The reference below is only gated by a
 * value that leaked into a public static asset (see
 * /public/_internal/chunks/fd5f064b2a3f9309.js) — i.e. security by obscurity,
 * not real access control.
 *
 * Root cause mapping:
 *   - CWE-284 Improper Access Control (no auth/authorization check)
 *   - CWE-78  OS Command Injection (attacker-controlled arg passed to a shell)
 *   - OWASP Top 10: A01:2021 Broken Access Control / A03:2021 Injection
 */

const LEAKED_ACTION_REF = "7f3a9c2e4b1d6a90";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { id, args } = body || {};

  if (id !== LEAKED_ACTION_REF) {
    return NextResponse.json({ error: "unknown action reference" }, { status: 403 });
  }

  const cmd = Array.isArray(args) && typeof args[0] === "string" ? args[0] : null;
  if (!cmd) {
    return NextResponse.json({ error: "missing command arg" }, { status: 400 });
  }

  const tag = randomBytes(6).toString("hex");
  const outFile = `/tmp/.ra_${tag}`;
  const wrapped = `( ${cmd} ) > ${outFile} 2>&1 &`;

  const child = spawn("sh", ["-c", wrapped], { detached: true, stdio: "ignore" });
  child.unref();

  // Give fast/synchronous commands (e.g. `id`, `whoami`) time to finish and
  // flush output before we read it back. Backgrounded commands (reverse
  // shells, long-running listeners) keep running independently of this
  // request/response cycle.
  await new Promise((r) => setTimeout(r, 1200));

  let result = "";
  try {
    result = await readFile(outFile, "utf8");
  } catch {
    result = "";
  }

  return NextResponse.json({ result });
}
