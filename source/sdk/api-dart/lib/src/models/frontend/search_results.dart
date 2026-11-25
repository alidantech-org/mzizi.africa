import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/frontend/search_hit.dart';

part 'search_results.g.dart';

/// Search Results
@JsonSerializable(includeIfNull: false)
class FrontendSearchResults {
  const FrontendSearchResults({required this.hits, required this.language});
  final List<FrontendSearchHit> hits;
  final String language;

  factory FrontendSearchResults.fromJson(Map<String, dynamic> json) => _$FrontendSearchResultsFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendSearchResultsToJson(this);
}
