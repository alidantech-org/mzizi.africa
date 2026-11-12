//! Route table and shared state. Request IDs are attached to every request and echoed in
//! responses; tracing spans carry them so logs correlate without sensitive payloads.

use axum::routing::{get, post};
use axum::Router;
use mzizi_db_core::Pools;
use tower_http::request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer};
use tower_http::trace::TraceLayer;

use crate::routes;

#[derive(Clone)]
pub struct AppState {
    pub pools: Pools,
}

pub fn build(pools: Pools) -> Router {
    let state = AppState { pools };

    Router::new()
        .route("/health", get(routes::health::health))
        .route("/ready", get(routes::health::ready))
        .route(
            "/v1/auth/identity/resolve",
            post(routes::auth::resolve_identity),
        )
        .route(
            "/v1/auth/permissions/check",
            post(routes::auth::check_permission),
        )
        .route(
            "/v1/reference/schemes",
            get(routes::reference::list_schemes),
        )
        .route("/v1/reference/values", get(routes::reference::list_values))
        .route(
            "/v1/reference/values/lookup",
            post(routes::reference::lookup_value),
        )
        .with_state(state)
        .layer(PropagateRequestIdLayer::x_request_id())
        .layer(TraceLayer::new_for_http())
        .layer(SetRequestIdLayer::x_request_id(MakeRequestUuid))
}
