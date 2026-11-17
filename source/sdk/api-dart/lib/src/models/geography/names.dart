import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'names.g.dart';

/// A canonical, official, local, alternative, translated or historical name for a feature, with its language (`mul` or `und` when no single language applies), validity and provenance reference.
@JsonSerializable(includeIfNull: false)
class GeographyNames {
  const GeographyNames({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    required this.isDefault,
    required this.languageId,
    required this.name,
    required this.nameKindId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final bool isDefault;
  final String languageId;
  final String name;
  final String nameKindId;
  final DateTime updatedAt;
  final int version;

  factory GeographyNames.fromJson(Map<String, dynamic> json) => _$GeographyNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyNamesToJson(this);
}
