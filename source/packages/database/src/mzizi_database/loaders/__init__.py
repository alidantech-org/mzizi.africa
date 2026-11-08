"""Seed loaders for specific schemas. Each applies a folder of prepared inputs through parameterized SQL only, additively and idempotently.

The auth loader lives here until schema owners get their own loader packages; the auth DDL is owned by source/schema/database/auth.
"""
