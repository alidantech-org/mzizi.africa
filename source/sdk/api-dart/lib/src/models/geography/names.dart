import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';

part 'names.g.dart';

/// An official, local, alternative, translated or historical name for a feature, with optional language, validity and provenance reference.
@JsonSerializable(includeIfNull: false)
class GeographyNames {
  const GeographyNames({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    this.languageTag,
    required this.name,
    required this.nameKindId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final String? languageTag;
  final String name;
  final String nameKindId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory GeographyNames.fromJson(Map<String, dynamic> json) => _$GeographyNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyNamesToJson(this);
}
