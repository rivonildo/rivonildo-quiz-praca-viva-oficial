# Security Policy

## Reporting Security Issues

If you discover a security vulnerability or sensitive data exposure, please report it via GitHub Private Vulnerability Reporting or via WhatsApp at [https://wa.me/5574999140925](https://wa.me/5574999140925).

Please do not report security issues via public GitHub issues.

## Guidelines

- Never commit database credentials, passwords or secret keys.
- Use environment variables (`DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`) in production.
- Keep prepared statements enabled to prevent SQL injection.
