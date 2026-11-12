//! Mzizi database service: the HTTP boundary over `mzizi-db-core`.
//!
//! Runs on `MZIZI_DB_SERVICE_PORT` (default 3303) beside the legacy Bun service (3301).
//! Holds only runtime credentials; administrative work belongs to `mzizi-db-cli`.

use std::net::SocketAddr;

use mzizi_db_core::{Config, Pools};

mod router;
mod routes;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .json()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .init();

    let config = Config::from_env()?;
    let pools = Pools::connect(&config)?;
    let app = router::build(pools.clone());

    let addr = SocketAddr::from(([127, 0, 0, 1], config.service_port));
    tracing::info!(%addr, "mzizi-db-service listening");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(async {
            let _ = tokio::signal::ctrl_c().await;
        })
        .await?;

    pools.close().await;
    Ok(())
}
