import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'place_tallies.g.dart';

/// Place Tallies
@JsonSerializable(includeIfNull: false)
class ElectionPlaceTallies {
  const ElectionPlaceTallies({this.contestId, required this.countryId, required this.featureId, this.limit, this.offset});
  final String? contestId;
  final String countryId;
  final String featureId;
  final int? limit;
  final int? offset;

  factory ElectionPlaceTallies.fromJson(Map<String, dynamic> json) => _$ElectionPlaceTalliesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionPlaceTalliesToJson(this);
}
