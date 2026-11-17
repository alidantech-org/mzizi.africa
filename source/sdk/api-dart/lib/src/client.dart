import 'package:flutter_api_bridge/flutter_api_bridge.dart';
import 'package:mzizi_api/src/features/auth_feature.dart';
import 'package:mzizi_api/src/features/geography_feature.dart';
import 'package:mzizi_api/src/features/governance_feature.dart';
import 'package:mzizi_api/src/features/reference_feature.dart';

/// The generated API client: one typed feature client per group, sharing one connection.
class MziziApiClient {
  MziziApiClient(ApiConnection connection) : _connection = connection;

  final ApiConnection _connection;

  /// Auth operations.
  late final auth = AuthFeature(_connection);

  /// Geography operations.
  late final geography = GeographyFeature(_connection);

  /// Governance operations.
  late final governance = GovernanceFeature(_connection);

  /// Reference operations.
  late final reference = ReferenceFeature(_connection);
}
