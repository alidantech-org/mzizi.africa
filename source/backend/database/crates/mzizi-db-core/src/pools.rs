//! The two bounded connection pools.
//!
//! One pool per target database, each with its own credentials and limits, created lazily
//! and shared by cloning (`PgPool` is an `Arc` internally, so `Pools` is cheap to clone and
//! safe to share across Axum handlers and Tokio tasks). Backpressure comes from the bounded
//! pool itself: when all connections are busy, `acquire` queues up to `acquire_timeout` and
//! then fails with `Unavailable` instead of piling unbounded load onto PostgreSQL.

use sqlx::postgres::{PgPool, PgPoolOptions};

use crate::config::{Config, PoolConfig, TargetDatabase};
use crate::error::Error;

#[derive(Clone)]
pub struct Pools {
    main: PgPool,
    operations: PgPool,
}

impl Pools {
    /// Connects both pools. `connect_lazy` so startup does not hard-depend on database order;
    /// readiness is checked explicitly through [`Pools::ready`].
    pub fn connect(config: &Config) -> Result<Self, Error> {
        Ok(Pools {
            main: build(&config.main)?,
            operations: build(&config.operations)?,
        })
    }

    pub fn get(&self, target: TargetDatabase) -> &PgPool {
        match target {
            TargetDatabase::Main => &self.main,
            TargetDatabase::Operations => &self.operations,
        }
    }

    /// Readiness: one cheap round-trip per database. Used by the service's `/ready` endpoint
    /// and by the CLI before it takes a migration lock.
    pub async fn ready(&self, target: TargetDatabase) -> Result<(), Error> {
        sqlx::query("SELECT 1")
            .execute(self.get(target))
            .await
            .map_err(|_| Error::Unavailable(target))?;
        Ok(())
    }

    /// Closes both pools; called on graceful shutdown.
    pub async fn close(&self) {
        self.main.close().await;
        self.operations.close().await;
    }
}

fn build(config: &PoolConfig) -> Result<PgPool, Error> {
    PgPoolOptions::new()
        .max_connections(config.max_connections)
        .min_connections(config.min_connections)
        .acquire_timeout(config.acquire_timeout)
        .idle_timeout(config.idle_timeout)
        // Fail fast on a poisoned connection instead of handing it to a request.
        .test_before_acquire(true)
        .connect_lazy(&config.url)
        .map_err(Error::Database)
}
