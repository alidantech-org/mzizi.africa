import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/search_hit.dart';

part 'search_results.g.dart';

/// Search Results
@JsonSerializable(includeIfNull: false)
class InsightsSearchResults {
  const InsightsSearchResults({required this.counts, required this.hits, required this.query, required this.total});
  final Object? counts;
  final List<InsightsSearchHit> hits;
  final String query;
  final int total;

  factory InsightsSearchResults.fromJson(Map<String, dynamic> json) => _$InsightsSearchResultsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsSearchResultsToJson(this);
}
