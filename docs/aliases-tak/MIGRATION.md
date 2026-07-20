# Aliases TAK Migration Notes

TAK setup assets that previously lived under `cywf/aliases/tak` are now owned here in `cywf/otg-tak`.

## Source repository

- Former source: <https://github.com/cywf/aliases/tree/main/tak>
- Target owner: <https://github.com/cywf/otg-tak>

## Imported assets

- `scripts/aliases-tak/tak_setup.py` — interactive TAK client/server setup assistant
- `scripts/aliases-tak/setup_tak.sh` — shell launcher/setup helper
- `docs/aliases-tak/*.md` — original TAK notes for Docker, Tailscale, ZeroTier, TAK client, and TAK server

## Related aliases issues

The following `cywf/aliases` TAK setup issues were already addressed in the imported `tak_setup.py` and should be tracked here going forward if they regress:

- `cywf/aliases#86` — installer subprocess pipe handling
- `cywf/aliases#87` — consistent configuration file path
- `cywf/aliases#88` — Docker Compose v2/v1 detection

## Verification expectations

Before reporting TAK setup work complete, run at minimum:

```bash
python3 -m py_compile scripts/aliases-tak/tak_setup.py
bash -n scripts/aliases-tak/setup_tak.sh
```

For the full OTG-TAK application, use the repository CI and package scripts documented at the root of this repo.
