import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'levels.g.dart';

/// One level of a country's administrative or electoral ladder: its depth and the kind of place found there. The ladder is data, so no screen or read names levels.
@JsonSerializable(includeIfNull: false)
class GeographyLevels {
  const GeographyLevels({
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.depth,
    required this.featureKindId,
    required this.hierarchyKindId,
    required this.id,
    required this.isRoutingHierarchy,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int depth;
  final String featureKindId;
  final String hierarchyKindId;
  final String id;
  final bool isRoutingHierarchy;
  final DateTime updatedAt;
  final int version;

  factory GeographyLevels.fromJson(Map<String, dynamic> json) => _$GeographyLevelsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyLevelsToJson(this);
}
