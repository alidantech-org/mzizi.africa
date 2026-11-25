import 'package:json_annotation/json_annotation.dart';

part 'place_detail_parents.g.dart';

/// Place Detail Parents
@JsonSerializable(includeIfNull: false)
class GeographyPlaceDetailParents {
  const GeographyPlaceDetailParents({
    this.depth,
    this.fromYear,
    this.hierarchyId,
    required this.kindTerm,
    this.levelId,
    required this.parentCode,
    required this.parentId,
    this.toYear,
  });
  final int? depth;
  final int? fromYear;
  final String? hierarchyId;
  final String kindTerm;
  final String? levelId;
  final String parentCode;
  final String parentId;
  final int? toYear;

  factory GeographyPlaceDetailParents.fromJson(Map<String, dynamic> json) => _$GeographyPlaceDetailParentsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyPlaceDetailParentsToJson(this);
}
