import 'package:json_annotation/json_annotation.dart';

part 'search_query.g.dart';

/// Search Query
@JsonSerializable(includeIfNull: false)
class InsightsSearchQuery {
  const InsightsSearchQuery({this.kinds, this.languageCode, this.limit, required this.query});
  final String? kinds;
  final String? languageCode;
  final int? limit;
  final String query;

  factory InsightsSearchQuery.fromJson(Map<String, dynamic> json) => _$InsightsSearchQueryFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsSearchQueryToJson(this);
}
