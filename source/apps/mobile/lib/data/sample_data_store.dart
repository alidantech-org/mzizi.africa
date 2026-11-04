import 'dart:convert';

import 'package:flutter/services.dart';

/// Explicitly synthetic mobile presentation fixtures, never canonical records.
enum SampleTopic {
  geography('Geography', 'geography-detail.json'),
  people('People', 'person-profile.json'),
  elections('Elections', 'election-contest.json'),
  statistics('Statistics', 'statistics-series.json'),
  finance('Public money', 'finance-summary.json'),
  governance('Government', 'governance-structure.json'),
  political('Political parties', 'political-party.json'),
  legal('Law', 'legal-instrument.json'),
  procurement('Procurement', 'procurement-contract.json'),
  services('Public services', 'public-service.json');

  const SampleTopic(this.label, this.file);
  final String label;
  final String file;
}

class SampleDocument {
  const SampleDocument({required this.kind, required this.data});
  final String kind;
  final Map<String, dynamic> data;
}

class SampleDataStore {
  const SampleDataStore();

  Future<SampleDocument> load(SampleTopic topic) async {
    final source = await rootBundle.loadString(
      'assets/sample_data/' + topic.file,
    );
    final decoded = jsonDecode(source);
    if (decoded is! Map<String, dynamic> ||
        decoded['fixture'] != true ||
        decoded['schemaVersion'] != '1.0.0') {
      throw const FormatException('Unsupported sample data envelope.');
    }
    final meta = decoded['meta'];
    final data = decoded['data'];
    if (meta is! Map<String, dynamic> ||
        meta['source'] != 'synthetic-mobile-preview' ||
        meta['verified'] != false ||
        data is! Map<String, dynamic>) {
      throw const FormatException('Sample data must be marked fictional.');
    }
    return SampleDocument(kind: decoded['kind'] as String, data: data);
  }
}
