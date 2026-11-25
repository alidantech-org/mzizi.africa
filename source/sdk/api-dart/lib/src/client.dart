import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/features/auth_feature.dart';
import 'package:mzizi_api/src/features/civic_feature.dart';
import 'package:mzizi_api/src/features/community_feature.dart';
import 'package:mzizi_api/src/features/election_feature.dart';
import 'package:mzizi_api/src/features/event_feature.dart';
import 'package:mzizi_api/src/features/finance_feature.dart';
import 'package:mzizi_api/src/features/frontend_feature.dart';
import 'package:mzizi_api/src/features/geography_feature.dart';
import 'package:mzizi_api/src/features/governance_feature.dart';
import 'package:mzizi_api/src/features/history_feature.dart';
import 'package:mzizi_api/src/features/identity_feature.dart';
import 'package:mzizi_api/src/features/legal_feature.dart';
import 'package:mzizi_api/src/features/legislature_feature.dart';
import 'package:mzizi_api/src/features/media_feature.dart';
import 'package:mzizi_api/src/features/politics_feature.dart';
import 'package:mzizi_api/src/features/product_feature.dart';
import 'package:mzizi_api/src/features/reference_feature.dart';
import 'package:mzizi_api/src/features/source_feature.dart';
import 'package:mzizi_api/src/features/statistics_feature.dart';
import 'package:mzizi_api/src/features/vocabulary_feature.dart';

/// The generated API client: one typed feature client per group, sharing one connection.
class MziziApiClient {
  MziziApiClient(ApiConnection connection) : _connection = connection;

  final ApiConnection _connection;

  /// Auth operations.
  late final auth = AuthFeature(_connection);

  /// Civic operations.
  late final civic = CivicFeature(_connection);

  /// Community operations.
  late final community = CommunityFeature(_connection);

  /// Election operations.
  late final election = ElectionFeature(_connection);

  /// Event operations.
  late final event = EventFeature(_connection);

  /// Finance operations.
  late final finance = FinanceFeature(_connection);

  /// Frontend operations.
  late final frontend = FrontendFeature(_connection);

  /// Geography operations.
  late final geography = GeographyFeature(_connection);

  /// Governance operations.
  late final governance = GovernanceFeature(_connection);

  /// History operations.
  late final history = HistoryFeature(_connection);

  /// Identity operations.
  late final identity = IdentityFeature(_connection);

  /// Legal operations.
  late final legal = LegalFeature(_connection);

  /// Legislature operations.
  late final legislature = LegislatureFeature(_connection);

  /// Media operations.
  late final media = MediaFeature(_connection);

  /// Politics operations.
  late final politics = PoliticsFeature(_connection);

  /// Product operations.
  late final product = ProductFeature(_connection);

  /// Reference operations.
  late final reference = ReferenceFeature(_connection);

  /// Source operations.
  late final source = SourceFeature(_connection);

  /// Statistics operations.
  late final statistics = StatisticsFeature(_connection);

  /// Vocabulary operations.
  late final vocabulary = VocabularyFeature(_connection);
}
