//! `mzizi-db`: administration CLI for the two foundation databases.
//!
//! Every command names its target explicitly (`--target main|operations`); nothing defaults
//! to a database. Administrative credentials (`MZIZI_DB_MAIN_ADMIN_URL`,
//! `MZIZI_DB_OPERATIONS_ADMIN_URL`) are read only here, never by the service.

use clap::{Parser, Subcommand, ValueEnum};
use mzizi_db_core::TargetDatabase;

mod commands;
mod ledger;

#[derive(Debug, Clone, Copy, ValueEnum)]
enum Target {
    Main,
    Operations,
}

impl From<Target> for TargetDatabase {
    fn from(target: Target) -> Self {
        match target {
            Target::Main => TargetDatabase::Main,
            Target::Operations => TargetDatabase::Operations,
        }
    }
}

#[derive(Parser)]
#[command(
    name = "mzizi-db",
    about = "Mzizi database foundation administration",
    version
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Show applied and pending releases for a target.
    Status {
        #[arg(long, value_enum)]
        target: Target,
    },
    /// Turn the generated schema snapshot into the immutable release stream (no database access).
    Assemble {
        #[arg(long, value_enum)]
        target: Target,
    },
    /// Plan: list pending releases and verify checksums without applying anything.
    Plan {
        #[arg(long, value_enum)]
        target: Target,
    },
    /// Apply pending releases under the per-database advisory lock.
    Migrate {
        #[arg(long, value_enum)]
        target: Target,
    },
    /// Verify applied releases against recorded checksums and the target's identity.
    Verify {
        #[arg(long, value_enum)]
        target: Target,
    },
    /// Provision service roles and grants (idempotent).
    Roles {
        #[arg(long, value_enum)]
        target: Target,
    },
    /// Load idempotent seed data from seed/_fixtures.
    Seed {
        #[arg(long, value_enum)]
        target: Target,
    },
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .init();

    let cli = Cli::parse();
    match cli.command {
        Command::Status { target } => commands::status(target.into()).await,
        Command::Assemble { target } => commands::assemble(target.into()).await,
        Command::Plan { target } => commands::plan(target.into()).await,
        Command::Migrate { target } => commands::migrate(target.into()).await,
        Command::Verify { target } => commands::verify(target.into()).await,
        Command::Roles { target } => commands::roles(target.into()).await,
        Command::Seed { target } => commands::seed(target.into()).await,
    }
}
