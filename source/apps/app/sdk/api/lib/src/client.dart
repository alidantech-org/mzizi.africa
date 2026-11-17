import 'package:flutter_api_bridge/flutter_api_bridge.dart';

/// The generated API client: one typed feature client per group, sharing one connection.
class MziziAppClient {
  MziziAppClient(ApiConnection connection)
      : _connection = connection;

  final ApiConnection _connection;

  /// Geography operations.
  late final geography = GeographyFeature(_connection);
}