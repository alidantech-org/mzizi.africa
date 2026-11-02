# Keycloak for local development

Single sign-on for the review workbench. Development only: users and passwords are fixtures (`dev-reviewer`, `dev-admin`, same ids as the seeded accounts), TLS is off. Production uses the real identity provider through the same settings.

```bash
docker run -d --name keycloak -p 8180:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  -v "$PWD/source/dev/keycloak:/opt/keycloak/data/import:ro" quay.io/keycloak/keycloak:26.0 start-dev --import-realm
```

API: `AUTH_ISSUER=http://localhost:8180/realms/mzizi`, `AUTH_JWKS_URL=http://localhost:8180/realms/mzizi/protocol/openid-connect/certs`.
Web: `OIDC_ISSUER=http://localhost:8180/realms/mzizi`, `OIDC_CLIENT_ID=mzizi-web`.
