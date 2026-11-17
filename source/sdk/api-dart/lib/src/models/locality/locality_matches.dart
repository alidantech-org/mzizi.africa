import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/locality_unit.dart';

part 'locality_matches.g.dart';

/// Locality Matches
@JsonSerializable(includeIfNull: false)
class LocalityLocalityMatches {
  const LocalityLocalityMatches({required this.places});
  final List<LocalityLocalityUnit> places;

  factory LocalityLocalityMatches.fromJson(Map<String, dynamic> json) => _$LocalityLocalityMatchesFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityLocalityMatchesToJson(this);
}
