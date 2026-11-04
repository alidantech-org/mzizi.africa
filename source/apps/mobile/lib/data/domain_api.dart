import 'dart:convert';

import 'package:http/http.dart' as http;

import 'api_configuration.dart';
import 'geography_api.dart' show JsonObject;

/// Read-only client for public Mzizi event and finance contracts.
///
/// The API origin is shared with geography so every mobile domain uses the
/// same NestJS service; the app never connects directly to PostgreSQL.
class DomainApiClient {
  DomainApiClient({http.Client? client, String? baseUrl})
    : _client = client ?? http.Client(),
      _baseUrl = baseUrl ?? defaultMziziApiBaseUrl;

  static final instance = DomainApiClient();

  final http.Client _client;
  final String _baseUrl;

  bool get isConfigured => _baseUrl.trim().isNotEmpty;

  Uri _uri(String path, Map<String, String> query) {
    if (!isConfigured) {
      throw StateError('Set MZIZI_API_BASE_URL to connect to Mzizi data.');
    }
    return Uri.parse(_baseUrl.trim())
        .resolve(path)
        .replace(queryParameters: query);
  }

  Future<({List<JsonObject> items, int page, int totalPages, int total})> _list(
    String path,
    String key,
    Map<String, String> query,
  ) async {
    late final http.Response response;
    try {
      response = await _client
          .get(_uri(path, query), headers: const {'accept': 'application/json'})
          .timeout(const Duration(seconds: 12));
    } on http.ClientException {
      throw Exception(
        'Cannot reach the Mzizi API at $_baseUrl. Start the NestJS API and confirm this address is reachable from the app.',
      );
    } on Exception catch (error) {
      if (error.toString().contains('TimeoutException')) {
        throw Exception(
          'The Mzizi API at $_baseUrl did not respond. Start the NestJS API and check its database connection.',
        );
      }
      rethrow;
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception('Mzizi API returned HTTP ${response.statusCode}.');
    }
    final decoded = jsonDecode(response.body);
    if (decoded is! Map || decoded[key] is! List) {
      throw const FormatException(
        'Mzizi API returned an unexpected list response.',
      );
    }
    final items = <JsonObject>[];
    for (final item in decoded[key] as List) {
      if (item is! Map) {
        throw const FormatException('Mzizi API returned an invalid record.');
      }
      items.add({
        for (final entry in item.entries) entry.key.toString(): entry.value,
      });
    }
    final meta = decoded['meta'];
    final page = meta is Map ? (meta['page'] as num?)?.toInt() ?? 0 : 0;
    final totalPages = meta is Map
        ? (meta['totalPages'] as num?)?.toInt() ?? 0
        : 0;
    final total = meta is Map ? (meta['total'] as num?)?.toInt() ?? 0 : 0;
    return (items: items, page: page, totalPages: totalPages, total: total);
  }

  Future<({List<JsonObject> items, int page, int totalPages, int total})>
  events({String? query, int page = 1, int limit = 20}) =>
      _list('/v1/events/events', 'events', {
        'page': '$page',
        'limit': '$limit',
        if (query != null && query.trim().isNotEmpty) 'q': query.trim(),
      });

  Future<({List<JsonObject> items, int page, int totalPages, int total})>
  fiscalYears({int page = 1, int limit = 100}) => _list(
    '/v1/finance/fiscal-years',
    'fiscalYears',
    {'page': '$page', 'limit': '$limit', 'includeHistory': 'true'},
  );

  Future<({List<JsonObject> items, int page, int totalPages, int total})>
  budgets({String? fiscalYearId, int page = 1, int limit = 20}) =>
      _list('/v1/finance/budgets', 'budgets', {
        'page': '$page',
        'limit': '$limit',
        if (fiscalYearId != null && fiscalYearId.isNotEmpty)
          'fiscalYearId': fiscalYearId,
      });
}
