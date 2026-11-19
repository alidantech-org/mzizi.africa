import 'package:flutter_api_bridge/flutter_api_bridge.dart';

import 'src/client.dart';

export 'package:flutter_api_bridge/flutter_api_bridge.dart'
    show
        ApiAuth,
        ApiBridgeConfig,
        ApiCacheConfig,
        ApiConnection,
        ApiGetRequestOptions,
        ApiLogger,
        ApiLoggingConfig,
        ApiRequestOptions,
        ApiResult,
        ApiRetryConfig,
        AuthStrategy,
        BearerStrategy,
        CookieStrategy,
        DeveloperApiLogger,
        NoAuthStrategy;
export 'package:mzizi_api/src/client.dart';
export 'package:mzizi_api/src/features/auth_feature.dart';
export 'package:mzizi_api/src/features/experience_feature.dart';
export 'package:mzizi_api/src/features/geography_feature.dart';
export 'package:mzizi_api/src/features/governance_feature.dart';
export 'package:mzizi_api/src/features/insights_feature.dart';
export 'package:mzizi_api/src/features/interactions_feature.dart';
export 'package:mzizi_api/src/features/ledger_feature.dart';
export 'package:mzizi_api/src/features/locality_feature.dart';
export 'package:mzizi_api/src/features/reference_feature.dart';
export 'package:mzizi_api/src/endpoints/auth_endpoints.dart';
export 'package:mzizi_api/src/endpoints/experience_endpoints.dart';
export 'package:mzizi_api/src/endpoints/geography_endpoints.dart';
export 'package:mzizi_api/src/endpoints/governance_endpoints.dart';
export 'package:mzizi_api/src/endpoints/insights_endpoints.dart';
export 'package:mzizi_api/src/endpoints/interactions_endpoints.dart';
export 'package:mzizi_api/src/endpoints/ledger_endpoints.dart';
export 'package:mzizi_api/src/endpoints/locality_endpoints.dart';
export 'package:mzizi_api/src/endpoints/reference_endpoints.dart';
export 'package:mzizi_api/src/models/auth/account_collection.dart';
export 'package:mzizi_api/src/models/auth/account_read.dart';
export 'package:mzizi_api/src/models/auth/account_summary.dart';
export 'package:mzizi_api/src/models/auth/account_window.dart';
export 'package:mzizi_api/src/models/auth/accounts.dart';
export 'package:mzizi_api/src/models/auth/delegation_roles.dart';
export 'package:mzizi_api/src/models/auth/delegations.dart';
export 'package:mzizi_api/src/models/auth/invitations.dart';
export 'package:mzizi_api/src/models/auth/login_identities.dart';
export 'package:mzizi_api/src/models/auth/memberships.dart';
export 'package:mzizi_api/src/models/auth/permissions.dart';
export 'package:mzizi_api/src/models/auth/role_assignments.dart';
export 'package:mzizi_api/src/models/auth/role_permissions.dart';
export 'package:mzizi_api/src/models/auth/roles.dart';
export 'package:mzizi_api/src/models/auth/scopes.dart';
export 'package:mzizi_api/src/models/civic/beneficiaries.dart';
export 'package:mzizi_api/src/models/civic/bids.dart';
export 'package:mzizi_api/src/models/civic/contracts.dart';
export 'package:mzizi_api/src/models/civic/deliveries.dart';
export 'package:mzizi_api/src/models/civic/facilities.dart';
export 'package:mzizi_api/src/models/civic/procurements.dart';
export 'package:mzizi_api/src/models/civic/project_features.dart';
export 'package:mzizi_api/src/models/civic/projects.dart';
export 'package:mzizi_api/src/models/civic/services.dart';
export 'package:mzizi_api/src/models/event/calendars.dart';
export 'package:mzizi_api/src/models/event/changes.dart';
export 'package:mzizi_api/src/models/event/events.dart';
export 'package:mzizi_api/src/models/event/items.dart';
export 'package:mzizi_api/src/models/event/names.dart';
export 'package:mzizi_api/src/models/event/occurrences.dart';
export 'package:mzizi_api/src/models/event/participants.dart';
export 'package:mzizi_api/src/models/event/rules.dart';
export 'package:mzizi_api/src/models/event/schedules.dart';
export 'package:mzizi_api/src/models/event/seasons.dart';
export 'package:mzizi_api/src/models/event/subjects.dart';
export 'package:mzizi_api/src/models/event/venues.dart';
export 'package:mzizi_api/src/models/experience/calendar.dart';
export 'package:mzizi_api/src/models/experience/calendar_event.dart';
export 'package:mzizi_api/src/models/experience/calendar_input.dart';
export 'package:mzizi_api/src/models/experience/capacity.dart';
export 'package:mzizi_api/src/models/experience/class_count.dart';
export 'package:mzizi_api/src/models/experience/context.dart';
export 'package:mzizi_api/src/models/experience/context_country.dart';
export 'package:mzizi_api/src/models/experience/context_input.dart';
export 'package:mzizi_api/src/models/experience/context_level.dart';
export 'package:mzizi_api/src/models/experience/copy_catalog.dart';
export 'package:mzizi_api/src/models/experience/copy_entry.dart';
export 'package:mzizi_api/src/models/experience/copy_input.dart';
export 'package:mzizi_api/src/models/experience/countdown.dart';
export 'package:mzizi_api/src/models/experience/countdown_milestone.dart';
export 'package:mzizi_api/src/models/experience/country_choice.dart';
export 'package:mzizi_api/src/models/experience/facilities_input.dart';
export 'package:mzizi_api/src/models/experience/facility_detail.dart';
export 'package:mzizi_api/src/models/experience/facility_key.dart';
export 'package:mzizi_api/src/models/experience/facility_list.dart';
export 'package:mzizi_api/src/models/experience/facility_row.dart';
export 'package:mzizi_api/src/models/experience/fact_list.dart';
export 'package:mzizi_api/src/models/experience/fact_row.dart';
export 'package:mzizi_api/src/models/experience/facts_input.dart';
export 'package:mzizi_api/src/models/experience/hosted_station.dart';
export 'package:mzizi_api/src/models/experience/place_ref.dart';
export 'package:mzizi_api/src/models/experience/recurrence_rule.dart';
export 'package:mzizi_api/src/models/filesystem/content_tags.dart';
export 'package:mzizi_api/src/models/filesystem/contents.dart';
export 'package:mzizi_api/src/models/filesystem/file_extensions.dart';
export 'package:mzizi_api/src/models/filesystem/file_versions.dart';
export 'package:mzizi_api/src/models/filesystem/files.dart';
export 'package:mzizi_api/src/models/filesystem/folders.dart';
export 'package:mzizi_api/src/models/filesystem/media.dart';
export 'package:mzizi_api/src/models/filesystem/taggings.dart';
export 'package:mzizi_api/src/models/filesystem/tags.dart';
export 'package:mzizi_api/src/models/finance/appropriations.dart';
export 'package:mzizi_api/src/models/finance/budget_versions.dart';
export 'package:mzizi_api/src/models/finance/budgets.dart';
export 'package:mzizi_api/src/models/finance/debts.dart';
export 'package:mzizi_api/src/models/finance/fiscal_periods.dart';
export 'package:mzizi_api/src/models/finance/flows.dart';
export 'package:mzizi_api/src/models/finance/funds.dart';
export 'package:mzizi_api/src/models/finance/money_entity.dart';
export 'package:mzizi_api/src/models/geography/assets.dart';
export 'package:mzizi_api/src/models/geography/changes.dart';
export 'package:mzizi_api/src/models/geography/classifications.dart';
export 'package:mzizi_api/src/models/geography/feature_collection.dart';
export 'package:mzizi_api/src/models/geography/feature_detail.dart';
export 'package:mzizi_api/src/models/geography/feature_detail_names.dart';
export 'package:mzizi_api/src/models/geography/feature_entry.dart';
export 'package:mzizi_api/src/models/geography/feature_entry_names.dart';
export 'package:mzizi_api/src/models/geography/feature_geometry.dart';
export 'package:mzizi_api/src/models/geography/feature_geometry_collection.dart';
export 'package:mzizi_api/src/models/geography/feature_key.dart';
export 'package:mzizi_api/src/models/geography/feature_kind.dart';
export 'package:mzizi_api/src/models/geography/feature_kind_collection.dart';
export 'package:mzizi_api/src/models/geography/feature_window.dart';
export 'package:mzizi_api/src/models/geography/features.dart';
export 'package:mzizi_api/src/models/geography/geometries.dart';
export 'package:mzizi_api/src/models/geography/geometry_window.dart';
export 'package:mzizi_api/src/models/geography/identifiers.dart';
export 'package:mzizi_api/src/models/geography/levels.dart';
export 'package:mzizi_api/src/models/geography/names.dart';
export 'package:mzizi_api/src/models/geography/relationships.dart';
export 'package:mzizi_api/src/models/governance/agenda.dart';
export 'package:mzizi_api/src/models/governance/authority_scopes.dart';
export 'package:mzizi_api/src/models/governance/bills.dart';
export 'package:mzizi_api/src/models/governance/hansards.dart';
export 'package:mzizi_api/src/models/governance/holders.dart';
export 'package:mzizi_api/src/models/governance/institution_collection.dart';
export 'package:mzizi_api/src/models/governance/institution_detail.dart';
export 'package:mzizi_api/src/models/governance/institution_detail_mandates.dart';
export 'package:mzizi_api/src/models/governance/institution_detail_names.dart';
export 'package:mzizi_api/src/models/governance/institution_detail_offices.dart';
export 'package:mzizi_api/src/models/governance/institution_entry.dart';
export 'package:mzizi_api/src/models/governance/institution_entry_names.dart';
export 'package:mzizi_api/src/models/governance/institution_key.dart';
export 'package:mzizi_api/src/models/governance/institution_window.dart';
export 'package:mzizi_api/src/models/governance/institutions.dart';
export 'package:mzizi_api/src/models/governance/mandates.dart';
export 'package:mzizi_api/src/models/governance/motions.dart';
export 'package:mzizi_api/src/models/governance/obligations.dart';
export 'package:mzizi_api/src/models/governance/office_detail.dart';
export 'package:mzizi_api/src/models/governance/office_detail_holders.dart';
export 'package:mzizi_api/src/models/governance/office_detail_holders_names.dart';
export 'package:mzizi_api/src/models/governance/office_key.dart';
export 'package:mzizi_api/src/models/governance/offices.dart';
export 'package:mzizi_api/src/models/governance/relationships.dart';
export 'package:mzizi_api/src/models/governance/reports.dart';
export 'package:mzizi_api/src/models/governance/sittings.dart';
export 'package:mzizi_api/src/models/governance/speeches.dart';
export 'package:mzizi_api/src/models/governance/stages.dart';
export 'package:mzizi_api/src/models/governance/terms.dart';
export 'package:mzizi_api/src/models/governance/votes.dart';
export 'package:mzizi_api/src/models/insights/board_input.dart';
export 'package:mzizi_api/src/models/insights/browse_input.dart';
export 'package:mzizi_api/src/models/insights/code_input.dart';
export 'package:mzizi_api/src/models/insights/compare_options.dart';
export 'package:mzizi_api/src/models/insights/compare_options_hierarchy.dart';
export 'package:mzizi_api/src/models/insights/compare_options_hierarchy_unit.dart';
export 'package:mzizi_api/src/models/insights/compare_options_input.dart';
export 'package:mzizi_api/src/models/insights/compare_options_metrics.dart';
export 'package:mzizi_api/src/models/insights/compare_options_nearby.dart';
export 'package:mzizi_api/src/models/insights/compare_options_place.dart';
export 'package:mzizi_api/src/models/insights/compare_options_top.dart';
export 'package:mzizi_api/src/models/insights/comparison.dart';
export 'package:mzizi_api/src/models/insights/comparison_a.dart';
export 'package:mzizi_api/src/models/insights/comparison_b.dart';
export 'package:mzizi_api/src/models/insights/comparison_input.dart';
export 'package:mzizi_api/src/models/insights/comparison_rows.dart';
export 'package:mzizi_api/src/models/insights/content_input.dart';
export 'package:mzizi_api/src/models/insights/content_list.dart';
export 'package:mzizi_api/src/models/insights/content_list_categories.dart';
export 'package:mzizi_api/src/models/insights/content_list_input.dart';
export 'package:mzizi_api/src/models/insights/content_list_items.dart';
export 'package:mzizi_api/src/models/insights/content_list_items_category.dart';
export 'package:mzizi_api/src/models/insights/content_list_items_classification.dart';
export 'package:mzizi_api/src/models/insights/content_list_items_front_matter.dart';
export 'package:mzizi_api/src/models/insights/content_list_items_subject.dart';
export 'package:mzizi_api/src/models/insights/content_page.dart';
export 'package:mzizi_api/src/models/insights/content_page_content.dart';
export 'package:mzizi_api/src/models/insights/content_page_content_category.dart';
export 'package:mzizi_api/src/models/insights/content_page_content_front_matter.dart';
export 'package:mzizi_api/src/models/insights/content_page_content_subject.dart';
export 'package:mzizi_api/src/models/insights/content_page_related.dart';
export 'package:mzizi_api/src/models/insights/content_page_related_category.dart';
export 'package:mzizi_api/src/models/insights/content_page_related_front_matter.dart';
export 'package:mzizi_api/src/models/insights/content_page_related_subject.dart';
export 'package:mzizi_api/src/models/insights/election_detail.dart';
export 'package:mzizi_api/src/models/insights/election_detail_contests.dart';
export 'package:mzizi_api/src/models/insights/election_detail_election.dart';
export 'package:mzizi_api/src/models/insights/election_detail_totals.dart';
export 'package:mzizi_api/src/models/insights/election_detail_units.dart';
export 'package:mzizi_api/src/models/insights/election_detail_units_candidates.dart';
export 'package:mzizi_api/src/models/insights/election_detail_units_winner.dart';
export 'package:mzizi_api/src/models/insights/election_input.dart';
export 'package:mzizi_api/src/models/insights/election_list.dart';
export 'package:mzizi_api/src/models/insights/election_list_elections.dart';
export 'package:mzizi_api/src/models/insights/election_list_elections_runner_up.dart';
export 'package:mzizi_api/src/models/insights/election_list_elections_winner.dart';
export 'package:mzizi_api/src/models/insights/gov_tree_input.dart';
export 'package:mzizi_api/src/models/insights/governance_tabs.dart';
export 'package:mzizi_api/src/models/insights/governance_tabs_arms.dart';
export 'package:mzizi_api/src/models/insights/governance_tabs_arms_institutions.dart';
export 'package:mzizi_api/src/models/insights/governance_tabs_arms_institutions_kind.dart';
export 'package:mzizi_api/src/models/insights/governance_tabs_tabs.dart';
export 'package:mzizi_api/src/models/insights/governance_tree.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_edges.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_legend.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_nodes.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_nodes_body.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_nodes_how.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_nodes_performance.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_nodes_refs.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_nodes_tier.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_nodes_unit.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_rail.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_rail_refs.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_rail_unit.dart';
export 'package:mzizi_api/src/models/insights/governance_tree_tab.dart';
export 'package:mzizi_api/src/models/insights/id_input.dart';
export 'package:mzizi_api/src/models/insights/indicator_map.dart';
export 'package:mzizi_api/src/models/insights/indicator_map_indicator.dart';
export 'package:mzizi_api/src/models/insights/indicator_map_units.dart';
export 'package:mzizi_api/src/models/insights/indicator_series.dart';
export 'package:mzizi_api/src/models/insights/indicator_series_indicator.dart';
export 'package:mzizi_api/src/models/insights/indicator_series_points.dart';
export 'package:mzizi_api/src/models/insights/institution_detail.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_children.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_children_relation.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_content.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_content_category.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_content_classification.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_content_front_matter.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_content_subject.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_institution.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_institution_arm.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_institution_basis.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_institution_kind.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_institution_parent.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_leaders.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_leaders_how.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_leaders_tier.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_leaders_unit.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_legal_basis.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_metrics.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_parents.dart';
export 'package:mzizi_api/src/models/insights/institution_detail_parents_relation.dart';
export 'package:mzizi_api/src/models/insights/institution_list.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms_groups.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_arm.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_basis.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_kind.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms_groups_institutions_parent.dart';
export 'package:mzizi_api/src/models/insights/institution_list_arms_groups_kind.dart';
export 'package:mzizi_api/src/models/insights/institutions_input.dart';
export 'package:mzizi_api/src/models/insights/law_input.dart';
export 'package:mzizi_api/src/models/insights/law_instrument.dart';
export 'package:mzizi_api/src/models/insights/law_list.dart';
export 'package:mzizi_api/src/models/insights/leader_profile.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_activity.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_activity_contributions.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_activity_recent.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_activity_speeches.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_activity_votes.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_contacts.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_election.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_evidence.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_leader.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_media.dart';
export 'package:mzizi_api/src/models/insights/leader_profile_offices.dart';
export 'package:mzizi_api/src/models/insights/leader_tree.dart';
export 'package:mzizi_api/src/models/insights/leader_tree_levels.dart';
export 'package:mzizi_api/src/models/insights/leader_tree_levels_unit.dart';
export 'package:mzizi_api/src/models/insights/leaderboard.dart';
export 'package:mzizi_api/src/models/insights/leaderboard_metric.dart';
export 'package:mzizi_api/src/models/insights/leaderboard_metric_list.dart';
export 'package:mzizi_api/src/models/insights/leaderboard_row.dart';
export 'package:mzizi_api/src/models/insights/legal_basis.dart';
export 'package:mzizi_api/src/models/insights/legal_basis_input.dart';
export 'package:mzizi_api/src/models/insights/legal_basis_items.dart';
export 'package:mzizi_api/src/models/insights/legal_basis_subject.dart';
export 'package:mzizi_api/src/models/insights/map_input.dart';
export 'package:mzizi_api/src/models/insights/motion_detail.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_legal.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_legal_fiscal_year.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_legal_provision.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_members.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_motion.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_motion_contributions.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_parties.dart';
export 'package:mzizi_api/src/models/insights/motion_detail_tally.dart';
export 'package:mzizi_api/src/models/insights/motion_list.dart';
export 'package:mzizi_api/src/models/insights/motion_list_motions.dart';
export 'package:mzizi_api/src/models/insights/motions_input.dart';
export 'package:mzizi_api/src/models/insights/nearby_input.dart';
export 'package:mzizi_api/src/models/insights/nearby_projects.dart';
export 'package:mzizi_api/src/models/insights/nearby_projects_projects.dart';
export 'package:mzizi_api/src/models/insights/nearby_projects_projects_media.dart';
export 'package:mzizi_api/src/models/insights/party_detail.dart';
export 'package:mzizi_api/src/models/insights/party_detail_funding.dart';
export 'package:mzizi_api/src/models/insights/party_detail_members.dart';
export 'package:mzizi_api/src/models/insights/party_detail_party.dart';
export 'package:mzizi_api/src/models/insights/party_detail_results.dart';
export 'package:mzizi_api/src/models/insights/party_list.dart';
export 'package:mzizi_api/src/models/insights/party_list_parties.dart';
export 'package:mzizi_api/src/models/insights/place_browse.dart';
export 'package:mzizi_api/src/models/insights/place_browse_media.dart';
export 'package:mzizi_api/src/models/insights/place_child.dart';
export 'package:mzizi_api/src/models/insights/place_civic.dart';
export 'package:mzizi_api/src/models/insights/place_civic_classes.dart';
export 'package:mzizi_api/src/models/insights/place_civic_fund.dart';
export 'package:mzizi_api/src/models/insights/place_civic_infrastructure.dart';
export 'package:mzizi_api/src/models/insights/place_civic_leadership.dart';
export 'package:mzizi_api/src/models/insights/place_civic_leadership_evidence.dart';
export 'package:mzizi_api/src/models/insights/place_civic_projects.dart';
export 'package:mzizi_api/src/models/insights/place_civic_projects_media.dart';
export 'package:mzizi_api/src/models/insights/place_civic_years.dart';
export 'package:mzizi_api/src/models/insights/place_civic_years_classes.dart';
export 'package:mzizi_api/src/models/insights/place_crumb.dart';
export 'package:mzizi_api/src/models/insights/place_elections.dart';
export 'package:mzizi_api/src/models/insights/place_elections_elections.dart';
export 'package:mzizi_api/src/models/insights/place_elections_elections_contests.dart';
export 'package:mzizi_api/src/models/insights/place_elections_elections_contests_candidates.dart';
export 'package:mzizi_api/src/models/insights/place_elections_registration_trend.dart';
export 'package:mzizi_api/src/models/insights/place_elections_turnout_trend.dart';
export 'package:mzizi_api/src/models/insights/place_only.dart';
export 'package:mzizi_api/src/models/insights/place_statistics.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_breakdowns.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_age.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_community.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_language.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_residence.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_breakdowns_sex.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_comparisons.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_comparisons_place.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_siblings.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_siblings_density.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_siblings_population.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_topics.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators_latest.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators_previous.dart';
export 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators_series.dart';
export 'package:mzizi_api/src/models/insights/project_detail.dart';
export 'package:mzizi_api/src/models/insights/project_detail_evidence.dart';
export 'package:mzizi_api/src/models/insights/project_detail_media.dart';
export 'package:mzizi_api/src/models/insights/project_detail_procurement.dart';
export 'package:mzizi_api/src/models/insights/project_detail_procurement_bids.dart';
export 'package:mzizi_api/src/models/insights/project_detail_procurement_contracts.dart';
export 'package:mzizi_api/src/models/insights/project_detail_project.dart';
export 'package:mzizi_api/src/models/insights/search_hit.dart';
export 'package:mzizi_api/src/models/insights/search_query.dart';
export 'package:mzizi_api/src/models/insights/search_results.dart';
export 'package:mzizi_api/src/models/insights/series_input.dart';
export 'package:mzizi_api/src/models/insights/tender_input.dart';
export 'package:mzizi_api/src/models/insights/tender_list.dart';
export 'package:mzizi_api/src/models/insights/tender_list_summary.dart';
export 'package:mzizi_api/src/models/insights/tender_list_summary_by_status.dart';
export 'package:mzizi_api/src/models/insights/tender_list_summary_transparency.dart';
export 'package:mzizi_api/src/models/insights/tender_list_tenders.dart';
export 'package:mzizi_api/src/models/insights/tree_input.dart';
export 'package:mzizi_api/src/models/interactions/engagement.dart';
export 'package:mzizi_api/src/models/interactions/engagement_input.dart';
export 'package:mzizi_api/src/models/interactions/like_input.dart';
export 'package:mzizi_api/src/models/interactions/recorded.dart';
export 'package:mzizi_api/src/models/interactions/view_input.dart';
export 'package:mzizi_api/src/models/ledger/budget.dart';
export 'package:mzizi_api/src/models/ledger/budget_list.dart';
export 'package:mzizi_api/src/models/ledger/coalition.dart';
export 'package:mzizi_api/src/models/ledger/coalition_list.dart';
export 'package:mzizi_api/src/models/ledger/coverage_item.dart';
export 'package:mzizi_api/src/models/ledger/coverage_list.dart';
export 'package:mzizi_api/src/models/ledger/fund.dart';
export 'package:mzizi_api/src/models/ledger/fund_list.dart';
export 'package:mzizi_api/src/models/ledger/ledger_input.dart';
export 'package:mzizi_api/src/models/ledger/manifesto.dart';
export 'package:mzizi_api/src/models/ledger/manifesto_list.dart';
export 'package:mzizi_api/src/models/legal/editions.dart';
export 'package:mzizi_api/src/models/legal/effects.dart';
export 'package:mzizi_api/src/models/legal/instruments.dart';
export 'package:mzizi_api/src/models/legal/names.dart';
export 'package:mzizi_api/src/models/legal/provisions.dart';
export 'package:mzizi_api/src/models/legal/references.dart';
export 'package:mzizi_api/src/models/legal/relationships.dart';
export 'package:mzizi_api/src/models/legal/translations.dart';
export 'package:mzizi_api/src/models/legal/wordings.dart';
export 'package:mzizi_api/src/models/locality/citation_input.dart';
export 'package:mzizi_api/src/models/locality/evidence_detail.dart';
export 'package:mzizi_api/src/models/locality/evidence_ref.dart';
export 'package:mzizi_api/src/models/locality/language_choice.dart';
export 'package:mzizi_api/src/models/locality/language_list.dart';
export 'package:mzizi_api/src/models/locality/locality_matches.dart';
export 'package:mzizi_api/src/models/locality/locality_profile.dart';
export 'package:mzizi_api/src/models/locality/locality_unit.dart';
export 'package:mzizi_api/src/models/locality/media_ref.dart';
export 'package:mzizi_api/src/models/locality/office_holder.dart';
export 'package:mzizi_api/src/models/locality/place_input.dart';
export 'package:mzizi_api/src/models/locality/position_input.dart';
export 'package:mzizi_api/src/models/locality/procurement_item.dart';
export 'package:mzizi_api/src/models/locality/procurement_summary.dart';
export 'package:mzizi_api/src/models/locality/search_input.dart';
export 'package:mzizi_api/src/models/locality/source_collection.dart';
export 'package:mzizi_api/src/models/locality/source_entry.dart';
export 'package:mzizi_api/src/models/locality/source_search_input.dart';
export 'package:mzizi_api/src/models/official/branding.dart';
export 'package:mzizi_api/src/models/official/contacts.dart';
export 'package:mzizi_api/src/models/official/entities.dart';
export 'package:mzizi_api/src/models/official/identifiers.dart';
export 'package:mzizi_api/src/models/official/individuals.dart';
export 'package:mzizi_api/src/models/official/names.dart';
export 'package:mzizi_api/src/models/official/relationships.dart';
export 'package:mzizi_api/src/models/reference/copy.dart';
export 'package:mzizi_api/src/models/reference/country.dart';
export 'package:mzizi_api/src/models/reference/found_member.dart';
export 'package:mzizi_api/src/models/reference/language.dart';
export 'package:mzizi_api/src/models/reference/language_name.dart';
export 'package:mzizi_api/src/models/reference/member_collection.dart';
export 'package:mzizi_api/src/models/reference/member_entry.dart';
export 'package:mzizi_api/src/models/reference/member_key.dart';
export 'package:mzizi_api/src/models/reference/member_window.dart';
export 'package:mzizi_api/src/models/reference/pattern.dart';
export 'package:mzizi_api/src/models/reference/scheme.dart';
export 'package:mzizi_api/src/models/reference/scheme_collection.dart';
export 'package:mzizi_api/src/models/reference/scheme_entry.dart';
export 'package:mzizi_api/src/models/reference/scheme_window.dart';
export 'package:mzizi_api/src/models/reference/topic.dart';
export 'package:mzizi_api/src/models/reference/unit.dart';
export 'package:mzizi_api/src/models/reference/value.dart';
export 'package:mzizi_api/src/models/reference/value_label.dart';
export 'package:mzizi_api/src/models/reference/value_relation.dart';
export 'package:mzizi_api/src/models/shared/api_error.dart';
export 'package:mzizi_api/src/models/shared/association.dart';
export 'package:mzizi_api/src/models/shared/base_entity.dart';
export 'package:mzizi_api/src/models/shared/base_query.dart';
export 'package:mzizi_api/src/models/shared/coded_created.dart';
export 'package:mzizi_api/src/models/shared/coded_entity.dart';
export 'package:mzizi_api/src/models/shared/coded_identified.dart';
export 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
export 'package:mzizi_api/src/models/shared/coded_period_subject_entity.dart';
export 'package:mzizi_api/src/models/shared/coded_subject_entity.dart';
export 'package:mzizi_api/src/models/shared/created.dart';
export 'package:mzizi_api/src/models/shared/entity.dart';
export 'package:mzizi_api/src/models/shared/identified.dart';
export 'package:mzizi_api/src/models/shared/immutable.dart';
export 'package:mzizi_api/src/models/shared/page_window.dart';
export 'package:mzizi_api/src/models/shared/paginated_response.dart';
export 'package:mzizi_api/src/models/shared/pagination_meta.dart';
export 'package:mzizi_api/src/models/shared/period_entity.dart';
export 'package:mzizi_api/src/models/shared/subject_reference.dart';
export 'package:mzizi_api/src/models/shared/timestamped.dart';
export 'package:mzizi_api/src/models/source/addresses.dart';
export 'package:mzizi_api/src/models/source/artifacts.dart';
export 'package:mzizi_api/src/models/source/attributions.dart';
export 'package:mzizi_api/src/models/source/captures.dart';
export 'package:mzizi_api/src/models/source/citations.dart';
export 'package:mzizi_api/src/models/source/coverage.dart';
export 'package:mzizi_api/src/models/source/discoveries.dart';
export 'package:mzizi_api/src/models/source/domains.dart';
export 'package:mzizi_api/src/models/source/editions.dart';
export 'package:mzizi_api/src/models/source/links.dart';
export 'package:mzizi_api/src/models/source/products.dart';
export 'package:mzizi_api/src/models/source/publishers.dart';
export 'package:mzizi_api/src/models/source/relationships.dart';
export 'package:mzizi_api/src/models/source/slugs.dart';
export 'package:mzizi_api/src/models/source/sources.dart';
export 'package:mzizi_api/src/models/source/verifications.dart';
export 'package:mzizi_api/src/enums/auth/account_status.dart';
export 'package:mzizi_api/src/enums/auth/auth_action.dart';
export 'package:mzizi_api/src/enums/auth/auth_actor_kind.dart';
export 'package:mzizi_api/src/enums/auth/membership_status.dart';
export 'package:mzizi_api/src/enums/filesystem/access.dart';
export 'package:mzizi_api/src/enums/filesystem/retention.dart';
export 'package:mzizi_api/src/enums/legal/provision_kind.dart';
export 'package:mzizi_api/src/enums/legal/reference_method.dart';
export 'package:mzizi_api/src/enums/legal/reference_relation.dart';
export 'package:mzizi_api/src/enums/legal/review_status.dart';
export 'package:mzizi_api/src/enums/legal/translation_method.dart';
export 'package:mzizi_api/src/enums/reference/language_name_kind.dart';
export 'package:mzizi_api/src/enums/reference/value_label_kind.dart';
export 'package:mzizi_api/src/enums/reference/value_relation_kind.dart';
export 'package:mzizi_api/src/enums/shared/date_precision.dart';
export 'package:mzizi_api/src/enums/shared/sort_direction.dart';
export 'package:mzizi_api/src/enums/shared/subject_table.dart';
export 'package:mzizi_api/src/enums/source/address_kind.dart';
export 'package:mzizi_api/src/enums/source/http_method.dart';
export 'package:mzizi_api/src/enums/source/source_kind.dart';
export 'package:mzizi_api/src/enums/source/verification_outcome.dart';

/// Root facade for the generated Mzizi Api package.
///
/// Applications import only this package. It owns a named flutter_api_bridge connection and
/// exposes the typed client and safe session controls.
class MziziApi {
  MziziApi._(ApiConnection connection) : client = MziziApiClient(connection);

  static const String connectionKey = 'mzizi_api';

  static MziziApi? _instance;

  /// Configures the package with the full transport configuration.
  static Future<void> configure(ApiBridgeConfig config, {bool replace = true}) async {
    await FlutterApiBridge.configure(key: connectionKey, config: config, replace: replace);
    _instance = null;
  }

  /// Configures the package with production defaults.
  static Future<void> initialize({
    required Uri baseUri,
    AuthStrategy auth = const CookieStrategy(),
    Map<String, String> defaultHeaders = const <String, String>{},
    bool replace = true,
  }) => configure(
    ApiBridgeConfig(baseUri: baseUri, auth: auth, defaultHeaders: defaultHeaders),
    replace: replace,
  );

  static ApiConnection get connection => FlutterApiBridge.requireConnection(connectionKey);

  static ApiAuth get auth => connection.auth;

  /// Starts or switches the user session after login; changing it clears the previous cache.
  static Future<void> initializeUserSession({required String sessionId, String? bearerToken, Map<String, String>? authHeaders}) =>
      connection.initializeUserSession(sessionId: sessionId, bearerToken: bearerToken, authHeaders: authHeaders);

  static Future<void> clearActiveSessionCache() => connection.clearActiveSessionCache();

  static Future<void> clearAllCache() => connection.clearAllCache();

  /// Clears the cache, credentials and persistent cookies.
  static Future<void> logout() async {
    await connection.logout();
    _instance = null;
  }

  static MziziApi get instance => _instance ??= MziziApi._(connection);

  static Future<void> dispose() async {
    _instance = null;
    await FlutterApiBridge.removeConnection(connectionKey);
  }

  final MziziApiClient client;
}
