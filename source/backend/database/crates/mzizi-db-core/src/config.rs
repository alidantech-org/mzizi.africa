//! Configuration. Runtime credentials come from the environment and are never logged.
//!
//! The service loads only the runtime URLs. Administrative URLs (`*_ADMIN_URL`) are read
//! exclusively by the CLI binary; the service cannot run DDL because it never sees them.

use std::time::Duration;

use crate::error::Error;

/// The two target databases. Everything that touches a database names its target explicitly.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum TargetDatabase {
    /// `mzizi`: canonical domain data.
    Main,
    /// `mzizi_operations`: platform operations.
    Operations,
}

impl TargetDatabase {
    pub fn as_str(self) -> &'static str {
        match self {
            TargetDatabase::Main => "main",
            TargetDatabase::Operations => "operations",
        }
    }

    /// The database name this target must identify as (checked by `verify`, recorded in `_mzizi`).
    pub fn database_name(self) -> &'static str {
        match self {
            TargetDatabase::Main => "mzizi",
            TargetDatabase::Operations => "mzizi_operations",
        }
    }
}

/// Pool sizing and timeouts for one database.
#[derive(Debug, Clone)]
pub struct PoolConfig {
    pub url: String,
    pub max_connections: u32,
    pub min_connections: u32,
    pub acquire_timeout: Duration,
    pub idle_timeout: Duration,
}

/// Runtime configuration for the service and the shared parts of the CLI.
#[derive(Debug, Clone)]
pub struct Config {
    pub main: PoolConfig,
    pub operations: PoolConfig,
    pub service_port: u16,
}

impl Config {
    /// Loads runtime configuration from the environment.
    ///
    /// Required: `MZIZI_DB_MAIN_URL`, `MZIZI_DB_OPERATIONS_URL`.
    /// Optional: `MZIZI_DB_SERVICE_PORT` (default 3303), `MZIZI_DB_MAX_CONNECTIONS` (default 10),
    /// `MZIZI_DB_MIN_CONNECTIONS` (default 1).
    pub fn from_env() -> Result<Self, Error> {
        let main_url = require_env("MZIZI_DB_MAIN_URL")?;
        let operations_url = require_env("MZIZI_DB_OPERATIONS_URL")?;
        let service_port = parse_env("MZIZI_DB_SERVICE_PORT", 3303u16)?;
        let max_connections = parse_env("MZIZI_DB_MAX_CONNECTIONS", 10u32)?;
        let min_connections = parse_env("MZIZI_DB_MIN_CONNECTIONS", 1u32)?;

        let pool = |url: String| PoolConfig {
            url,
            max_connections,
            min_connections,
            acquire_timeout: Duration::from_secs(5),
            idle_timeout: Duration::from_secs(600),
        };

        Ok(Config {
            main: pool(main_url),
            operations: pool(operations_url),
            service_port,
        })
    }

    /// The administrative URL for one target, read only by the CLI.
    /// `MZIZI_DB_MAIN_ADMIN_URL` / `MZIZI_DB_OPERATIONS_ADMIN_URL`.
    pub fn admin_url(target: TargetDatabase) -> Result<String, Error> {
        match target {
            TargetDatabase::Main => require_env("MZIZI_DB_MAIN_ADMIN_URL"),
            TargetDatabase::Operations => require_env("MZIZI_DB_OPERATIONS_ADMIN_URL"),
        }
    }
}

fn require_env(name: &'static str) -> Result<String, Error> {
    std::env::var(name).map_err(|_| Error::Config { variable: name })
}

fn parse_env<T: std::str::FromStr>(name: &'static str, default: T) -> Result<T, Error> {
    match std::env::var(name) {
        Ok(value) => value.parse().map_err(|_| Error::Config { variable: name }),
        Err(_) => Ok(default),
    }
}
