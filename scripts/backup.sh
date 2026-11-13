#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
umask 077
mkdir -p backups
backup_file="backups/portfolio-$(date -u +%Y%m%d-%H%M%S-%N).sql.gz"
temporary_file="$(mktemp backups/.backup.XXXXXX)"
trap 'rm -f "$temporary_file"' EXIT
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$temporary_file"
gzip -t "$temporary_file"
mv "$temporary_file" "$backup_file"
printf 'Backup guardado en %s\n' "$backup_file"
